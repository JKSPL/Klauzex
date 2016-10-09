var alarmName = 'dictionaryRefresh';
var dictionaryUpdatePeriodInMinutes = 60;
var enabled = true;

function updateDictionary() {
    console.log('updating dictionary...');
    Clauses.get('https://www.uokik.gov.pl/download.php?id=1064').then(
        function (dict) {
            chrome.storage.local.set({ 'dictionary': dict });
            initAlgosy(dict, function () { console.log('dictionary updated!') });
        });
}

chrome.tabs.onActivated.addListener(function () {
    chrome.tabs.getSelected(null, function (tab) {
        var url = new URL(tab.url);
        console.log('updated to ' + url);
        var domain = url.hostname;
        updateIcon(domain);
    });
});

chrome.runtime.onInstalled.addListener(updateDictionary);
chrome.alarms.onAlarm.addListener(updateDictionary);

chrome.alarms.create(alarmName,
{
    delayInMinutes: dictionaryUpdatePeriodInMinutes,
    periodInMinutes: dictionaryUpdatePeriodInMinutes
}
);

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.request == "getGlobalState") {
            sendResponse(enabled);
        }
        else if (request.request == "toggleGlobalState") {
            enabled = !enabled;
            updateIcon();
            sendResponse(enabled);
        }
        else if (request.request == 'setIcon')
        {
            updateIcon();
        }
    });

function updateIcon()
{
    if (enabled) {
        chrome.tabs.getSelected(null, function (tab) {
            var url = new URL(tab.url)
            var domain = url.hostname

            isWhitelisted(domain, function (isWhitelisted) {
                if (isWhitelisted) {
                    chrome.browserAction.setIcon({ path: 'img/shopYellow38.png' }, function () { });
                }
                else {
                    chrome.browserAction.setIcon({ path: 'img/shopGreen38.png' }, function () { });
                }
            });
        });
        
    }
    else {
        chrome.browserAction.setIcon({ path: 'img/shopRed38.png' }, function () { });
    }
}
