var processedClauses;

function generateText(clauses) {
    var acc = "";
    for (var i = 0; i < clauses.length; i++) {
        acc += i.toString();
        acc += ". ";
        acc += clauses[i].clause;
        acc += "<br>";
    }
    return acc;
}

function trimToChar(str, char1, char2) {
    var prefixTrim = 0;
    var suffixTrim = 0;
    while (prefixTrim != str.length && str[prefixTrim] != char1) {
        prefixTrim++;
        console.log(prefixTrim);
    }
    while (suffixTrim != str.length && str[str.length - suffixTrim - 1] != char2) {
        suffixTrim++;
    }
    if (prefixTrim + suffixTrim >= str.length) {
        return "";
    }
    return str.substring(prefixTrim + 1, str.length - 1 - suffixTrim);
}

function trimToApostrophes(str) {
    return trimToChar(str, '"', '"');
}

function sanitize(clauses) {
    clauses = clauses.filter(function (clause) {
        return clause.branch && clause.branch.indexOf("ELEKTRONICZNY") != -1;
    });
    for (var i = 0; i < clauses.length; i++) {
        clauses[i].clause = trimToApostrophes(clauses[i].clause);
    }
    clauses = clauses.filter(function (clause) {
        return clause.clause != "";
    });
    return clauses;
}

function init(clauses, onReady) {
    readyClauses = true;
    globalClauses = clauses;
    var processedClauses = sanitize(clauses);

    chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
      if (request.request == "clauses")
          sendResponse({ clauses: processedClauses });
    });

    chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.request == "changeHtml")
            sendResponse({ html: generateText(processedClauses) });
    });

    if (onReady) {
        onReady();
    }
}