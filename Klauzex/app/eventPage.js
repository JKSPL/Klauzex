var alarmName = 'dictionaryRefresh';
var dictionaryUpdatePeriodInMinutes = 60;

function updateDictionary() {
    console.log('updating dictionary...');
    Clauses.get('https://www.uokik.gov.pl/download.php?id=1064').then(
        function (dict) {
            initAlgosy(dict, function () { console.log('dictionary updated!') });
        });
}

chrome.runtime.onInstalled.addListener(updateDictionary);
chrome.alarms.onAlarm.addListener(updateDictionary);

chrome.alarms.create(alarmName,
{
    delayInMinutes: dictionaryUpdatePeriodInMinutes,
    periodInMinutes: dictionaryUpdatePeriodInMinutes
}
);
