var processedClauses;
var trashExact = [
    "…",
    "sp. z o.o.",
    "z o.o.",
    "sp.j.",
    "S.A.",
    "-",
    "itp.",
    "itp",
    "itd.",
    "np.",
    "tj.",
    "itd",
    "®",
    "w/w",
    "treść",
    "ww.",
    "ew.",
    "tzn.",
    ",",
    ":",
    "...",
    "sobie",
    "także",
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
    "dowoln",
    "powyższ",
    "poniższ",
    "wcześn",
    "ewent",
    "email",
    "mail",
    "każd",
    "żadn",
    "żaden",
    "treśc",
    "właściw",
    "jakiekolw",
    "niniej",
    "wszelk",
    "wszystk",
    "wyżej wymien",
    "mechan",
    "postanowie",
    "jednak",
    "dokonywan",
    "wprowadzen",
    "drobn",
    "rzeczywist",
]

var trashSuffix = [
];

function containsPrefix(string) {
    return "\\b(" + escapeRegExp(string) + "[\\S]*)";
}

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
            "(\\b" + escapeRegExp("sprzedając") + "[\\S]+)",
            "(\\b" + escapeRegExp("firm") + "[\\S]*)",
            "(\\b" + escapeRegExp("administr") + "[\\S]*)",
            "(\\b" + escapeRegExp("siedzib") + "[\\S]*)",
            containsPrefix("program"),
            containsPrefix("księgar"),
            "(\\b" + escapeRegExp("kurier") + "[\\S]*)",
            "(\\b" + escapeRegExp("spół") + "[\\S]*)",
            "(\\b" + escapeRegExp("pozwan") + "[\\S]*)",
            "(\\b" + escapeRegExp("perfumer") + "[\\S]*)",
            "(\\b" + escapeRegExp("producent") + "[\\S]*)",
            "(\\b" + escapeRegExp("podmiot") + "[\\S]*)",
            "(\\b" + escapeRegExp("wydawc") + "[\\S]*)",
            "(\\b" + escapeRegExp("dostawc") + "[\\S]*)",
            "(\\b" + escapeRegExp("wysył") + "[\\S]*)",
            "(\\b" + escapeRegExp("przewoz") + "[\\S]*)",
            containsPrefix("z ograniczoną odpowiedzialnością"),
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
            "(\\b" + escapeRegExp("odbiorc") + "[\\S]*)",
        ]
    },
    {
        tag: "codeofconduct",
        regex: [
            containsPrefix("regulam"),
            containsPrefix("zapis"),
            containsPrefix("przywilej"),
            containsPrefix("przepis"),
            containsPrefix("zasad"),
        ]
    },
    {
        tag: "commodity",
        regex: [
            containsPrefix("korzystanie z"),
            containsPrefix("nagrod"),
            "(\\b" + escapeRegExp("dostarcz") + "[\\S]*)",
            containsPrefix("towar"),
            "(\\b" + escapeRegExp("produk") + "[\\S]+)",
            containsPrefix("usług"),
            "(\\b" + escapeRegExp("przesył") + "[\\S]+)",
            "(\\b" + escapeRegExp("umow") + "[\\S]+)",
            containsPrefix("kredyt"),
            containsPrefix("kupno"),
            containsPrefix("kupna"),
            containsPrefix("umów"),
            containsPrefix("zegar"),
            containsPrefix("dostaw"),
            containsPrefix("zamów"),
            containsPrefix("opakowan"),
            containsPrefix("wyrob"),
            containsPrefix("wyrób"),
            containsPrefix("zakup"),
            containsPrefix("transakc"),
            "(\\b" + escapeRegExp("sprzeda") + "[\\S]+)",
            "(\\b" + escapeRegExp("używ") + "[\\S]+)",
            "(\\b" + escapeRegExp("otrzym") + "[\\S]+)",
            "(\\b" + escapeRegExp("odebr") + "[\\S]+)",
            "(\\b" + escapeRegExp("ofer") + "[\\S]+)",
        ]
    },
    {
        tag: "judge",
        regex: [
            "(\\b" + escapeRegExp("sąd") + "[\\S]*)",
            "(\\b" + escapeRegExp("powszech") + "[\\S]*)",
            "(\\b" + escapeRegExp("rejon") + "[\\S]*)",
            "(\\b" + escapeRegExp("sęd") + "[\\S]*)",
        ]
    },
    {
        tag: "judgedecide",
        regex: [
            "(\\b" + escapeRegExp("rozstrzyg") + "[\\S]*)",
            "(\\b" + escapeRegExp("rozpatryw") + "[\\S]*)",
            "(\\b" + escapeRegExp("rozpozn") + "[\\S]*)",
        ]
    },
    {
        tag: "changeallowance",
        regex: [
            "(\\b" + escapeRegExp("zastrzega praw") + "[\\S]*)",
            "(\\b" + escapeRegExp("zastrzegają praw") + "[\\S]*)",
            "(\\b" + escapeRegExp("zastrzega moż") + "[\\S]*)",
            "(\\b" + escapeRegExp("zastrzegają moż") + "[\\S]*)",
            "(\\b" + escapeRegExp("zastrzegamy praw") + "[\\S]*)",
            "(\\b" + escapeRegExp("ma prawo do zmian") + "[\\S]*)",
            "(\\b" + escapeRegExp("ma prawo wprowadzania zmian") + "[\\S]*)",
            "(\\b" + escapeRegExp("prawo do zmian") + "[\\S]*)",
            "(\\b" + escapeRegExp("prawo do zmian") + "[\\S]*)",
            "(\\b" + escapeRegExp("może zostać zmieniony") + "[\\S]*)",
            "(\\b" + escapeRegExp("jest uprawniony") + "[\\S]*)",
        ]
    },
    {
        tag: "change",
        regex: [
            containsPrefix("zmian"),
        ]
    },
    {
        tag: "notResponsible",
        regex: [
            containsPrefix("nie ponosi odp"),
            containsPrefix("nie gwarant"),
            containsPrefix("nie ponosimy odp"),
            containsPrefix("nie odpowiad"),
            containsPrefix("nie jest odpow"),
            containsPrefix("nie bierze odpow"),
            containsPrefix("nie jest gwarantem"),
        ]
    },
    {
        tag: "complaint",
        regex: [
            containsPrefix("kwesti"),
            containsPrefix("sprawa"),
            containsPrefix("zwrot"),
            containsPrefix("reklam"),
            containsPrefix("spor"),
            containsPrefix("spór"),
            containsPrefix("zwrac"),
            containsPrefix("zwrot"),
            containsPrefix("roszcz"),
        ]
    },
    {
        tag: "error",
        regex: [
            containsPrefix("błęd"),
            containsPrefix("uszkodz"),
            containsPrefix("szkod"),
            containsPrefix("uchyb"),
            containsPrefix("zniszcz"),
            containsPrefix("błąd"),
            containsPrefix("wad"),
            containsPrefix("usterk"),
            containsPrefix("zaginię"),
            containsPrefix("niedostarczeni"),
            containsPrefix("nieprawid"),
            containsPrefix("opóźni"),
            containsPrefix("winy"),
            containsPrefix("zgniecion"),
        ]
    },
    {
        tag: "isvalidsince",
        regex: [
            containsPrefix("wchodzi w życie od"),
            containsPrefix("będą ważne od"),
            containsPrefix("obowiązuje od"),
            containsPrefix("obowiązują od"),
            containsPrefix("wchodzą w życie od"),
        ]
    },
    {
        tag: "warranty",
        regex: [
            containsPrefix("gwaran"),
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
    clause = clause.replace(new RegExp("(\\((.*?)\\))", "ig"), "");
    clause = clause.replace(new RegExp("(\\[(.*?)\\])", "ig"), "");
    for (var i = 0; i < trashExact.length; i++) {
        clause = replaceAll(clause, trashExact[i], "");
    }
    clause = replaceDoubleSpaces(clause);
    for (var i = 0; i < trashPrefix.length; i++) {
        clause = clause.replace(new RegExp("(" + escapeRegExp(trashPrefix[i]) + "[\\S]*)", "ig"), "")
    }
    for (var i = 0; i < trashSuffix.length; i++) {
        clause = clause.replace(new RegExp("([\\S]+" + escapeRegExp(trashSuffix[i]) + ")", "ig"), "")
    }
    for(var j = 0; j < rozponawanieRegexow.length; j++){
        danyTag = rozponawanieRegexow[j];
        var replacement = "#" + danyTag.tag + "#";
        for (var i = 0; i < danyTag.regex.length; i++) {
            //var temp = clause.match(new RegExp(danyTag.regex[i], "gi")) || [];
            clause = clause.replace(new RegExp(danyTag.regex[i], "gi"), replacement);
        }
    }
    var replacement = "#company#";
    clause = clause.replace(new RegExp("\\b([\\S]*[A-Z]+[\\S]*)", "g"), replacement);
    clause = replaceDoubleSpaces(clause);
    if (clause[clause.length - 1] == ' ') {
        clause = clause.substring(0, clause.length - 1);
    }
    if (clause[clause.length - 1] == '.') {
        clause = clause.substring(0, clause.length - 1);
    }
    if (clause[0] == ' ') {
        clause = clause.substring(1, clause.length - 1);
    }
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
        clauses[i].clause = clauses[i].clause.replace(new RegExp("(\\((.*?)\\))", "ig"), "");
        clauses[i].clause = clauses[i].clause.replace(new RegExp("(\\[(.*?)\\])", "ig"), "");
        clauses[i].clause = trimToApostrophes(clauses[i].clause);
        clauses[i].clause = sanitizeSingle(clauses[i].clause);
    }
    clauses = clauses.filter(function (clause) {
        return clause.clause.length > 20 && clause.clause.indexOf('.') == -1;
    });
    return clauses;
}

function initAlgosy(clauses, onReady) {
    readyClauses = true;
    globalClauses = clauses;
    var processedClauses = sanitize(clauses);

    chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.request == "clauses") {
            var accumulator = [];
            var gotClauses = request.input;
            for (var i = 0; i < gotClauses.length; i++) {
                var result = sanitizeSingle(gotClauses[i]);
                console.log("KOMPRESJA");
                console.log("Z: '" + gotClauses[i] + "'");
                console.log("DO: '" + result + "'");
                for (var j = 0; j < processedClauses.length; j++) {
                    if(processedClauses[j].clause == result){
                        accumulator.push({
                            text: gotClauses[i],
                            clause: processedClauses[j].id
                        });
                        break;
                    }
                }
            }
            sendResponse(accumulator);
        }
        if (request.request == "changeHtml")
            sendResponse({ html: generateText(processedClauses) });
    });
    if (onReady) {
        onReady();
    }
}
console.log(useless);