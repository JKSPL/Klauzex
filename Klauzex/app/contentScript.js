chrome.storage.local.get('dictionary', function (dictionary) {
    dictionary = dictionary.dictionary;
    inputContent = document.all[0].innerText;
    findLinksWithPolicies();
});

function findLinksWithPolicies()
{
    var policiesLinks = [];
    var policiesTerms = ["regulamin", "zasady", "warunki", "reguły"];

    $('a').each(function() {
        for (i = 0; i < policiesTerms.length; i++)
        {
            if (this.innerHTML.indexOf(policiesTerms[i]) != -1)
            {
                policiesLinks.push(this);
                break;
            }
        }
    });
    
    return policiesLinks;
}