
PDFJS.workerSrc = 'https://nopaste.me/view/raw/6f532bfc';
getWhitelistedDomains(function (domains)
{
    if(domains.indexOf(document.domain) == -1)
        findScams();
})

function findScams()
{
    var inputContent = sanitizeAndSplitSentences(document.body.innerText);
    getScams(inputContent, function (scams) {
        console.log("Found " + scams.length + " scams in page");
        if (scams.length == 0)
        {
            findScamsInLinks();
        }
        else {
            chrome.storage.local.get({ 'dictionary': [] }, function (result)
            {
                dict = result.dictionary;
                uiArray = [];
                for (i = 0; i < scams.length; i++) {
                    uiArray.push({
                        id: scams[i].clause,
                        clause: scams[i].text,
                        original: dict[scams[i].clause - 1]
                    });
                }
                console.log(uiArray);
                KlauzulexUI.showWarning(uiArray);
            })
        }
    });
}

function findScamsInLinks() {
    policiesLinks = findLinksWithPolicies();
    console.log('Found ' + policiesLinks.length + ' links');
    uniqueLinks = policiesLinks.getUnique();;
    console.log(uniqueLinks);
    console.log('Found ' + uniqueLinks.length + ' unique links');
    for (i = 0; i < uniqueLinks.length; i++)
    {
        (function(i) {
            var href = uniqueLinks[i].href;
            if(href.endsWith('pdf'))
            {
                new Pdf2TextClass().pdfToText(href, function (s, t) { },
                function(text)
                {
                    findScamInLinked(text, href);
                });
            }
            else
            {
                iframe = $('<iframe src="' + href + '" style="display: none"></iframe>');
                iframe.on('load', function () {
                    findScamInLinked(this.contentWindow.document.body.innerText, href);
                });
                iframe.appendTo('body');
            }
        })(i);
    }
}

function findScamInLinked(text, href)
{
    var inputContent = sanitizeAndSplitSentences(text);
    getScams(inputContent, function (scams) {
        uniqueScams = [];
        for (i = 0; i < scams.length; i++)
        {
            found = false;
            for(j = 0; j < uniqueScams.length; j++)
            {
                if(uniqueScams[j].clause == scams[i].clause)
                {
                    found = true;
                    break;
                }
            }
            if (!found) {
                uniqueScams.push(scams[i]);
            }
        }
        chrome.storage.local.get({ 'dictionary': [] }, function (result) {
            dict = result.dictionary;
            uiArray = [];
            for (i = 0; i < uniqueScams.length; i++) {
                uiArray.push({
                    id: uniqueScams[i].clause,
                    clause: uniqueScams[i].text,
                    original: dict[uniqueScams[i].clause - 1]
                });
            }
            console.log("Found " + uniqueScams.length + " scams in " + href);
            if (uniqueScams.length != 0) {
                console.log(uniqueScams);
                KlauzulexUI.showRulesWarning(href, uiArray);
            }
        });
    });
}

function findLinksWithPolicies() {
    var policiesLinks = [];
    var policiesTerms = ["regulamin", "zasady", "warunki", "reguły"];
    $('a').each(function() {
        for (i = 0; i < policiesTerms.length; i++) {
            if (this.innerHTML.toLowerCase().indexOf(policiesTerms[i]) != -1) {
                policiesLinks.push(this);
                break;
            }
        }
    });
    return policiesLinks;
}

function Pdf2TextClass() {
    var self = this;
    this.complete = 0;

    /**
     *
     * @param data ArrayBuffer of the pdf file content
     * @param callbackPageDone To inform the progress each time
     *        when a page is finished. The callback function's input parameters are:
     *        1) number of pages done;
     *        2) total number of pages in file.
     * @param callbackAllDone The input parameter of callback function is 
     *        the result of extracted text from pdf file.
     *
     */
    this.pdfToText = function (data, callbackPageDone, callbackAllDone) {
        console.assert(data instanceof ArrayBuffer || typeof data == 'string');
        PDFJS.getDocument(data).then(function (pdf) {
            var div = document.getElementById('viewer');

            var total = pdf.numPages;
            callbackPageDone(0, total);
            var layers = {};
            for (i = 1; i <= total; i++) {
                pdf.getPage(i).then(function (page) {
                    var n = page.pageNumber;
                    page.getTextContent().then(function (textContent) {
                        if (null != textContent.items) {
                            var page_text = "";
                            var last_block = null;
                            for (var k = 0; k < textContent.items.length; k++) {
                                var block = textContent.items[k];
                                if (last_block != null && last_block.str[last_block.str.length - 1] != ' ') {
                                    if (block.x < last_block.x)
                                        page_text += "\r\n";
                                    else if (last_block.y != block.y && (last_block.str.match(/^(\s?[a-zA-Z])$|^(.+\s[a-zA-Z])$/) == null))
                                        page_text += ' ';
                                }
                                page_text += block.str;
                                last_block = block;
                            }

                            layers[n] = page_text + "\n\n";
                        }
                        ++self.complete;
                        callbackPageDone(self.complete, total);
                        if (self.complete == total) {
                            window.setTimeout(function () {
                                var full_text = "";
                                var num_pages = Object.keys(layers).length;
                                for (var j = 1; j <= num_pages; j++)
                                    full_text += layers[j];
                                callbackAllDone(full_text);
                            }, 1000);
                        }
                    }); // end  of page.getTextContent().then
                }); // end of page.then
            } // of for
        });
    }; // end of pdfToText()
}; // end of class

Array.prototype.getUnique = function () {
    var u = {}, a = [];
    for (var i = 0, l = this.length; i < l; ++i) {
        if (u.hasOwnProperty(this[i])) {
            continue;
        }
        a.push(this[i]);
        u[this[i]] = 1;
    }
    return a;
}
