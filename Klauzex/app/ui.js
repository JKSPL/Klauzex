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
            message: '<div id="klauzulex-warning"><p><strong>Ostrzeżenie:</strong><br> Regulamin może zawierać klauzule niedozwolone:</p>' + list + '</div>',
            layout: 'bar',
            effect: 'slidetop',
            ttl: 9999999,
            type: 'error', // notice, warning or error
            onOpen: function() {
                $('#klauzulex-warning a').click(function(e) {
                    e.preventDefault();
                    __centerElement($(e.target.getAttribute('href')));
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
            message: '<div id="klauzulex-warning"><p><strong>Ostrzeżenie:</strong><br/> Regulamin może zawierać klauzule niedozwolone. Przejdź do regulaminu:</p><br/><p><a href="' + link + '">' + link + '</a></p></div>',
            layout: 'bar',
            effect: 'slidetop',
            ttl: 9999999,
            type: 'error', // notice, warning or error
        });
        // show the notification
        notification.show();
    }

    function __getListItem(clauseInfo) {
        $('body').mark(clauseInfo.clause, {
            separateWordSearch: false,
            acrossElements: true,
            each: function(el) {
                $(el).attr('id', ANCHOR_REF + '-' + clauseInfo.id);
            }
        });
        var anchor = "#" + ANCHOR_REF + '-' + clauseInfo.id;
        return "<br/><p class='clause'><a href='" + anchor + "'>" + clauseInfo.clause + "</a></p>";
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