function getScams(plaintext, gotAnswer) {
    chrome.runtime.sendMessage({ request: "clauses", input: plaintext }, function (response) {
        gotAnswer(response);
    });
}

chrome.runtime.sendMessage({ request: "changeHtml" }, function (response) {
    document.body.innerHTML = response.html;
});