function getScams(plaintext, gotAnswer) {
    chrome.runtime.sendMessage({ request: "clauses", input: plaintext }, function (response) {
        gotAnswer(response);
    });
}