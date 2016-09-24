
//findScams()
console.log(sanitizeAndSplitSentences(document.body.innerText));

function findScams()
{
    var inputContent = document.body.innerText;
    getScams(inputContent, function (scams) {
        console.log("Found " + scams.length + " scams in page");
        uiArray = [];
        for (i = 0; i < scams.length; i++)
        {
            console.log(scams[i]);
            uiArray.push({id: scams[i].clause, clause: scams[i].text})
        }
        if(scams.length == 0)
            findScamsInLinks();
        else
        {
            KlauzulexUI.showWarning(uiArray);
        }
    });
}

function findScamsInLinks()
{
    policiesLinks = findLinksWithPolicies();
    console.log('Found ' + policiesLinks.length + ' links');
    for (i = 0; i < policiesLinks.length; i++)
    {
        (function (i) {
            href = policiesLinks[i].href;
            iframe = $('<iframe src="' + policiesLinks[i] + '" style="display: none"></iframe>');
            iframe.on('load', function () {
                var inputContent = this.contentWindow.document.body.innerText;
                getScams(inputContent, function (scams) {
                    console.log("Found " + scams.length + " scams in " + href);
                });
            });
            iframe.appendTo('body');
        })(i)
        
    }
}

function findLinksWithPolicies()
{
    var policiesLinks = [];
    var policiesTerms = ["regulamin", "zasady", "warunki", "reguły"];

    $('a').each(function() {
        for (i = 0; i < policiesTerms.length; i++)
        {
            if (this.innerHTML.toLowerCase().indexOf(policiesTerms[i]) != -1)
            {
                policiesLinks.push(this);
                break;
            }
        }
    });
    
    return policiesLinks;
}

