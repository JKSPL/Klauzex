var storageEntryName = 'dictionary';
var alarmName = 'dictionaryRefresh';
var dictionaryUpdatePeriodInMinutes = 60;


function updateDictionary() {
    console.log('updating dictionary');
}

chrome.runtime.onInstalled.addListener(updateDictionary);
chrome.alarms.onAlarm.addListener(updateDictionary);

chrome.alarms.create(alarmName,
{
    delayInMinutes: dictionaryUpdatePeriodInMinutes,
    periodInMinutes: dictionaryUpdatePeriodInMinutes
}
);
