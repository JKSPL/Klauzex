function getWhitelistedDomains(callback) {
    chrome.storage.sync.get({ whitelistedDomains: [] }, function (result) { callback(result.whitelistedDomains); });
}

function addWhitelistedDomain(domain) {
    getWhitelistedDomains(function (domains) {
        domains.push(domain);
        chrome.storage.sync.set({ whitelistedDomains: domains });
    });
}