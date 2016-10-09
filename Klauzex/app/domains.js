function getWhitelistedDomains(callback) {
    chrome.storage.sync.get({ whitelistedDomains: [] }, function (result) { callback(result.whitelistedDomains); });
}

function addWhitelistedDomain(domain) {
    getWhitelistedDomains(function (domains) {
        domains.push(domain);
        chrome.storage.sync.set({ whitelistedDomains: domains });
        chrome.runtime.sendMessage({ request: 'setIcon', domain: domain });
    });
}

function removeWhitelistedDomain(domain) {
    getWhitelistedDomains(function (domains) {
        var index = domains.indexOf(domain);
        if (index != -1)
        {
            domains.splice(index, 1);
            chrome.storage.sync.set({ whitelistedDomains: domains });
            chrome.runtime.sendMessage({ request: 'setIcon', domain: domain });
        }
    });
}

function isWhitelisted(domain, callback)
{
    getWhitelistedDomains(function(domains)
    {
        console.log(domains);
        callback(domains.indexOf(domain) != -1);
    })
}

