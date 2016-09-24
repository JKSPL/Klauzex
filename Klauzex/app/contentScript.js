chrome.storage.local.get('dictionary', function (dictionary) {
    dictionary  = dictionary.dictionary;
    console.log(dictionary);
});