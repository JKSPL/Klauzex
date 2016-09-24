KlauzulexUI = (function() {
    var ANCHOR_REF = 'klauzulex-anchor';
    var MAX_CLAUSES = 3;

    return {
        showWarning: showWarning
    };

    function showWarning(clauses) {
        clauses = clauses.slice(0, MAX_CLAUSES);
        var listItems = clauses.map(__getListItem).join("");
        var list = "<ul class='list'>" + listItems + "</ul>";
        var warning = $("<div id='klauzulex-warning' class='ui negative message'><div class='header'>Ostrzeżenie<span class='close'>Rozumiem</span></div><p>Wykryto niedozowolone klauzule w regulaminie:</p>" + list + "<p>Ten sprzedawca może chcieć Cie oszukać.</p></div>");
        var close = warning.find('.close');
        close.click(function() {
            $(this).closest('.message').hide();
        });
        warning.find('.list a').click(function(e) {
            e.preventDefault();
            __centerElement($(e.target.getAttribute('href')));
        });
        $('body').append(warning);
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
        return "<li><a href='" + anchor + "'>" + clauseInfo.clause + "</a></li>";
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