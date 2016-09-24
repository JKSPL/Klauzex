function generateText(clauses) {
    var acc = "";
    for (var i = 0; i < clauses.length; i++) {
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
    if(prefixTrim + suffixTrim >= str.length){
        return "";
    }
    return str.substring(prefixTrim + 1, str.length - 1 - suffixTrim);
}

function trimToApostrophes(str) {
    return trimToChar(str, '„', '”');
}

function sanitize(clauses) {
    clauses = clauses.filter(function (clause) {
        return clause.branch && clause.branch.indexOf("ELEKTRONICZNY") != -1;
    });
    for (var i = 0; i < clauses.length; i++) {
        clauses[i].clause = trimToApostrophes(clauses[i].clause);
    }
    return clauses;
}

var globalClauses;

function getScams(plaintext) {
    plaintext = plaintext.split(" ").filter(function (text) {
        return text != "";
    });
    if (plaintext.length == 0) {
        return [];
    } else {
        return [
        {
            clause: globalClauses[0],
            text: plaintext[0]
        }
        ];
    }
}

chrome.storage.local.get("dictionary", function (clauses) {
    clauses = clauses.dictionary;
    readyClauses = true;
    globalClauses = clauses;
    console.log(getScams("asd asd 123"));
    //window.globalClauses = clauses;
    //console.log(globalClauses);
    //var filtered = sanitize(clauses);
    //document.body.innerHTML = generateText(filtered);
})

