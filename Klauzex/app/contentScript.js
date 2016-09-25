getWhitelistedDomains(function(domains)
{
    if(domains.indexOf(document.domain) == -1)
        findScams();
})

function findScams()
{
    var inputContent = sanitizeAndSplitSentences(document.body.innerText);
    console.log(inputContent);
    getScams(inputContent, function (scams) {
        console.log("Found " + scams.length + " scams in page");
        uiArray = [];
        for (i = 0; i < scams.length; i++) {
            console.log(scams[i]);
            uiArray.push({
                id: scams[i].clause,
                clause: scams[i].text
            })
        }
        if (scams.length == 0)
        {
            findScamsInLinks();
        }
        else {
            KlauzulexUI.showWarning(uiArray);
        }
    });
}

function findScamsInLinks() {
    policiesLinks = findLinksWithPolicies();
    console.log('Found ' + policiesLinks.length + ' links');
    linksSet = {};
    for (i = 0; i < policiesLinks.length; i++)
    {
        linksSet[policiesLinks[i].href] = true;
    }
    console.log(linksSet);
    console.log('Found '+Object.keys(linksSet).length+' unique links');
    for (i = 0; i < Object.keys(linksSet).length; i++)
    {
        (function(i) {
            var href = Object.keys(linksSet)[i];
            iframe = $('<iframe src="' + href + '" style="display: none"></iframe>');
            iframe.on('load', function () {
                var inputContent = sanitizeAndSplitSentences(this.contentWindow.document.body.innerText);
                getScams(inputContent, function (scams) {
                    console.log("Found " + scams.length + " scams in " + href);
                    if(scams.length != 0)
                    {
                        KlauzulexUI.showRulesWarning(href);
                    }
                });
            });
            iframe.appendTo('body');
        })(i)
    }
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

