Clauses.get('https://www.uokik.gov.pl/download.php?id=1064').then(function (clauses) {
    //console.log(clauses);
    console.log(clauses[0].branch);
    var filtered = clauses.filter(function (clause) {
        if(clause.branch){
            return clause.branch.indexOf("ELEKTRONICZNY") != -1
        }
        return false;
    });
    console.log(filtered);
});