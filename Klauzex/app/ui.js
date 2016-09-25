KlauzulexUI = (function() {
    var ANCHOR_REF = 'klauzulex-anchor';
    var MAX_CLAUSES = 3;

    return {
        showWarning: showWarning,
        showRulesWarning: showRulesWarning
    };

    function showWarning(clauses) {
        var nonEmpty = clauses.filter(function(c) { 
            return c.clause.replace(/ /g,'').length > 0; 
        });
        if (nonEmpty.length === 0)
            return;

        clauses = clauses.slice(0, MAX_CLAUSES);
        var list = clauses.map(__getListItem).join("");

        var notification = new NotificationFx({
            message: '<div id="klauzulex-warning"><p><strong>Ostrzeżenie:</strong><br> Regulamin może zawierać klauzule niedozwolone:</p>' + list + '<br/><a class="white-list">Nie pokazuj więcej na tej domenie</a></div>',
            layout: 'bar',
            effect: 'slidetop',
            ttl: 9999999,
            type: 'error', // notice, warning or error
            onOpen: function() {
                $('#klauzulex-warning .clause').click(function(e) {
                    e.preventDefault();
                    __centerElement($(e.target.getAttribute('href')));
                });
                $('#klauzulex-warning .white-list').click(function(e) {
                    e.preventDefault();
                    notification.dismiss();
                    addWhitelistedDomain(document.domain);
                });
            },
            onClose: function() {
                $('body').unmark();
            }
        });
        // show the notification
        notification.show();
    }

    function showRulesWarning(link) {
        var notification = new NotificationFx({
            message: '<div id="klauzulex-warning"><p><strong>Ostrzeżenie:</strong><br/> Regulamin może zawierać klauzule niedozwolone. Przejdź do regulaminu:</p><br/><p><a href="' + link + '">' + link + '</a></p><br/><a class="white-list">Nie pokazuj więcej na tej domenie</a></div></div>',
            layout: 'bar',
            effect: 'slidetop',
            ttl: 9999999,
            type: 'error', // notice, warning or error
            onOpen: function() {
                $('#klauzulex-warning .white-list').click(function(e) {
                    e.preventDefault();
                    notification.dismiss();
                    addWhitelistedDomain(document.domain);
                });
            }
        });
        // show the notification
        notification.show();
    }

    function __getListItem(clauseInfo, idx) {
        $('body').mark(clauseInfo.clause, {
            separateWordSearch: false,
            acrossElements: true,
            each: function(el) {
                $(el).attr('id', ANCHOR_REF + '-' + idx);
            },
            filter: function(text, term, allCount, count) {
                // Only highlight first one
                return count == 0;
            }
        });
        var anchor = "#" + ANCHOR_REF + '-' + idx;
        var clauseInfoUrl = 'http://decyzje.uokik.gov.pl/nd_wz_um.nsf/WWW-wszystkie?SearchView&Query=([FORM]%3DPostanowienie)%20AND%20([Nr_pos_T]%20%3D%20%22' + clauseInfo.id + '%22)';
        return "<br/><p><a class='clause' href='" + anchor + "'>" + clauseInfo.clause + "</a> - (<a class='clause-info' href='" + clauseInfoUrl + "'>link do klauzuli</a>)</p>";
    }

    function __centerElement(el) {
        var elOffset = el.offset().top;
        var elHeight = el.height();
        var windowHeight = $(window).height();
        var offset;
        if (elHeight < windowHeight) {
            offset = elOffset - ((windowHeight / 2) - (elHeight / 2));
        } else {
            offset = elOffset;
        }
        $("html, body").animate({
            scrollTop: offset
        });
    }
    // var clauses = [{
    //     id: 1,
    //     clause: "Podmioty, o których mowa w art. 2.1, mogą nabywać Towary bez konieczności uprzedniej Rejestracji i posiadania Konta."
    // }, {
    //     id: 2,
    //     clause: "Z chwilą nabycia Towaru, podmiot, o którym mowa w zdaniach poprzednich, zawiera umowę, której przedmiotem są usługi świadczone przez Grupę Allegro w ramach Allegro, na warunkach określonych w Regulaminie."
    // }];
    // showWarning(clauses);
})();