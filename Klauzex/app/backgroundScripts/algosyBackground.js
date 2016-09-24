var processedClauses;
var trashExact = [
    "sp. z o.o.",
    "z o.o.",
    "sp.j.",
    "S.A.",
    "-",
    "itp.",
    "itp",
    "itd.",
    "itd",
    "®",
    "w/w",
    "treść",
    "zł",
    "ww.",
    "ew.",
    "tzn.",
    ",",
    "...",

];//wywala insensitive
function escapeRegExp(str) {
    return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}
var useless = [
    "(\\b" + escapeRegExp("ustaw") + "[\\S]*)",
    "(\\b" + escapeRegExp("uchwał") + "[\\S]*)",
    "(\\b" + escapeRegExp("ust.") + "[\\S]*)",
    "(\\b" + escapeRegExp("art.") + "[\\S]*)",
    "(\\b" + escapeRegExp("pkt.") + "[\\S]*)",
    "(\\b" + escapeRegExp("ul.") + "[\\S]*)",
    "(\\b" + escapeRegExp("al.") + "[\\S]*)",
]

var trashPrefix = [
    "ewent",
    "mail",
    "każd",
    "żadn",
    "żaden",
    "treśc",
    "właściw",
    "niniej",
    "wszelk",
    "wszystk",
    "wyżej wymien",
    "postanowie",
    "jedyn",
    "dokonywan",
    "wprowadzen",
]

var trashSuffix = [
];

var rozponawanieRegexow = [
    {
        tag: "company",
        regex: [
            "([\\S]+" + escapeRegExp(".pl/") + ")",
            "([\\S]+" + escapeRegExp(".pl") + ")",
            "([\\S]+" + escapeRegExp(".com") + ")",
            "(\\b" + escapeRegExp("sklep") + "[\\S]*)",
            "(\\b" + escapeRegExp("aptek") + "[\\S]*)",
            "(\\b" + escapeRegExp("właścic") + "[\\S]+)",
            "(\\b" + escapeRegExp("organizator") + "[\\S]*)",
            "(\\b" + escapeRegExp("usługodaw") + "[\\S]+)",
            "(\\b" + escapeRegExp("internetow") + "[\\S]+)",
            "(\\b" + escapeRegExp("sprzedawc") + "[\\S]+)",
            "(\\b" + escapeRegExp("firm") + "[\\S]*)",
            "(\\b" + escapeRegExp("administr") + "[\\S]*)",
            "(\\b" + escapeRegExp("siedzib") + "[\\S]*)",
            "(\\b" + escapeRegExp("kurier") + "[\\S]*)",
            "(\\b" + escapeRegExp("spół") + "[\\S]*)",
            "(\\b" + escapeRegExp("pozwan") + "[\\S]*)",
            "(\\b" + escapeRegExp("producent") + "[\\S]*)",
            "(\\\"(.*?)\\\")",
        ]
    },
    {
        tag: "customer",
        regex: [
            "([\\S]+" + escapeRegExp(".pl/") + ")",
            "([\\S]+" + escapeRegExp(".pl") + ")",
            "([\\S]+" + escapeRegExp(".com") + ")",
            "(\\b" + escapeRegExp("kupując") + "[\\S]+)",
            "(\\b" + escapeRegExp("klient") + "[\\S]*)",
            "(\\b" + escapeRegExp("usługobior") + "[\\S]*)",
            "(\\b" + escapeRegExp("zamawiając") + "[\\S]*)",
            "(\\b" + escapeRegExp("nabyw") + "[\\S]*)",
            "(\\b" + escapeRegExp("użytkowni") + "[\\S]*)",
        ]
    },
    {
        tag: "codeofconduct",
        regex: [
            "(regulam[\\w]+)",
            "(przywilej[\\w]+)",
        ]
    },
    {
        tag: "commodity",
        regex: [
            "(\\b" + escapeRegExp("towar") + "[\\S]*)",
            "(\\b" + escapeRegExp("produk") + "[\\S]+)",
            "(\\b" + escapeRegExp("usług") + "[\\S]+)",
            "(\\b" + escapeRegExp("przesył") + "[\\S]+)",
            "(\\b" + escapeRegExp("umow") + "[\\S]+)",
            "(\\b" + escapeRegExp("kupno") + "[\\S]+)",
            "(\\b" + escapeRegExp("kupna") + "[\\S]+)",
            "(\\b" + escapeRegExp("sprzeda") + "[\\S]+)",
        ]
    },
    {
        tag: "judge",
        regex: [
            "(\\b" + escapeRegExp("sąd") + "[\\S]*)",
            "(\\b" + escapeRegExp("sęd") + "[\\S]*)",
        ]
    },
    {
        tag: "judgeDecide",
        regex: [
            "(\\b" + escapeRegExp("rozstrzyg") + "[\\S]*)",
            "(\\b" + escapeRegExp("rozpatryw") + "[\\S]*)",
        ]
    },
    {
        tag: "changeAllowance",
        regex: [
            "(\\b" + escapeRegExp("prawo do zm") + "[\\S]*)",
        ]
    },
    {
        tag: "complaint",
        regex: [
            "(" + escapeRegExp("reklamac") + "[\\S]+)",
            "(" + escapeRegExp("spor") + "[\\S]+)",
            "(" + escapeRegExp("spór") + "[\\S]+)",
        ]
    }
];

function replaceAll(str, find, replace) {
    return str.replace(new RegExp(escapeRegExp(find), 'gi'), replace);
}

function replaceDoubleSpaces(str) {
    return str.replace(/ +(?= )/g, '');
}

function generateText(clauses) {
    var acc = "";
    for (var i = 0; i < clauses.length; i++) {
        acc += i.toString();
        acc += ". ";
        acc += clauses[i].id.toString();
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

function sanitizeSingle(clause) {
    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    clause = sanitizeText(clause);
    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    clause = clause.replace(new RegExp("(\\((.*?)\\))", "ig"), "");
    clause = clause.replace(new RegExp("(\\[(.*?)\\])", "ig"), "");
    clause = trimToApostrophes(clause);
    for (var i = 0; i < trashExact.length; i++) {
        clause = replaceAll(clause, trashExact[i], "");
    }
    for (var i = 0; i < trashPrefix.length; i++) {
        clause = clause.replace(new RegExp("(" + escapeRegExp(trashPrefix[i]) + "[\\S]*)", "ig"), "")
    }
    for (var i = 0; i < trashSuffix.length; i++) {
        clause = clause.replace(new RegExp("([\\S]+" + escapeRegExp(trashSuffix[i]) + ")", "ig"), "")
    }
    for(var j = 0; j < rozponawanieRegexow.length; j++){
        danyTag = rozponawanieRegexow[j];
        console.log(danyTag);
        var replacement = "#" + danyTag.tag + "#";
        for (var i = 0; i < danyTag.regex.length; i++) {
            var temp = clause.match(new RegExp(danyTag.regex[i], "gi")) || [];
            clause = clause.replace(new RegExp(danyTag.regex[i], "gi"), replacement);
            if (temp.length) {
                console.log(clause);
                console.log(temp);
            }
        }
    }
    clause = replaceDoubleSpaces(clause);
    return clause;
}

function goodBrackets(temp) {
    var goodCurly = (temp.match(/\(/g) || []).length == (temp.match(/\)/g) || []).length;
    var goodSharp = (temp.match(/\[/g) || []).length == (temp.match(/\]/g) || []).length;
    return goodCurly && goodSharp;
}

function notUseless(clause) {
    for (var i = 0; i < useless.length; i++){
        if (clause.match(new RegExp(useless[i], "i"))) {
            return false;
        }
    }
    return true;
}

function sanitize(clauses) {
    clauses = clauses.filter(function (clause) {
        return clause.branch && clause.branch.indexOf("ELEKTRONICZNY") != -1 && goodBrackets(clause.clause) && notUseless(clause.clause);
    });
    for (var i = 0; i < clauses.length; i++) {
        clauses[i].clause = sanitizeSingle(clauses[i].clause);
    }
    clauses = clauses.filter(function (clause) {
        return clause.clause.length > 21;
    });
    return clauses;
}

function initAlgosy(clauses, onReady) {
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
console.log(useless);