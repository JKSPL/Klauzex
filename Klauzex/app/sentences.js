var abbvs = ['ac', 'a.c', 'al', 'a.t', 'a.u.c', 'abs', 'absolw', 'ang', 'aa', 'a.i', 'a.m', 'AM', 'acc', 'a.s.c', 'al', 'al', 'ang', 'a', 'a.c', 'AD', 'a.C', 'a.m', 'arch', 'przest', 'arch', 'abp', 'aa', 'art', 'atm', 'at', 'b', 'bdb', 'bd', 'BC', 'belg', 'b.d', 'blp', 'blp', 'b.m', 'b.p', 'niesygn', 'b.r', 'b.u', 'BN', 'bm', 'br', 'bp', 'bł', 'błp', 'bot', 'b. ', 'cdn', 'col', 'cos', 'cykl', 'cyt', 'cyt', 'cz', 'czyt', 'd', 'd', 'dag', 'dent', 'dep', 'dgn', 'diag', 'rozp', 'ds', 'db', 'doc', 'dr', 'dr dr', 'dr n. med', 'dol', 'USD', 'dol. USA', 'dosł', 'dst', 'dost', 'dyr', 'dyr. dyr', 'dz', 'EEG', 'eeg', 'EKG', 'ekg', 'EMG', 'emg', 'e.i', 'e.a', 'etc', 'fant', 'farm', 'flam', 'fot', 'franc', 'fr', 'fr', 'gen', 'g', 'godz', 'g', 'gr', 'hab', 'hol', 'nid', 'hr', 'i in', 'i in', 'itd', 'itp', 'i wsp', 'i wsp', 'ib', 'ibid', 'inst', 'inż', 'iron', 'jw', 'yd', 'jm', 'jęz', 'jun', 'jr', 'kard', 'kol', 'col', 'kol', 'k', 'kop', 'kor', 'kr', 'ks', 'książ', 'ks', 'lek', 'lek. dent', 'lek. stom', 'lek. wet', 'lb', 'lic', 'l', 'l.dz', 'ldz', 'lm', 'lm', 'lmn', 'lmn', 'lp', 'lp', 'lp', 'lp', 'lb', 'v', 'l', 'lit', 'l', 'l.c', 'l.d', 'log', 'lg', 'ln', 'log', 'a', 'łac', 'łow', 'mgr', 'mjr', 'mc', 'mps', 'mpis', 'med', 'm.b', 'mkw', 'm', 'mies', 'm.in', 'min', 'muz', 'n', 'n', 'n.p.m', 'nadzw', 'ndzw', 'nzw', 'nz', 'np', 'nast', 'n.e', 'nt', 'ndst', 'nlb', 'nw', 'nb', 'NT', 'N.T', 'n/s', 'N/s', 'nr', 'ob', 'z o.o', 'o.o', 'zoo', 'o', 'oo', 'op. cit', 'os', 'pkt', 'pp', 'p.o', 'pes', 'pl', 'pl', 'pl', 'p. Chr', 'p.C', 'poch', 'pn', 'pt', 'poj', 'PN', 'płd', 'por', 'p.m', 'PS lub PS:', 'pow.b', 'pb', 'pow', 'płn', 'prof', 'prof. prof', 'przec', 'przec', 'prz. Chr', 'a.C', 'przest', 'arch', 'p.n.e', 'ps', 'psycht', 'psych', 'psychl', 'psych', 'płk', 'q', 'qu', 'rtg', 'rps', 'rpis', 'r', 'r', 'rż', 'ros', 'rozdz', 'rozp', 'dgn', 'diag', 'ryc', 'rys', 'rys', 'ryc', 'sam', 'sen', 'sen', 's', 'sek', 'sin', 's', 'sp', 's-ka', 'SA', 'M/s', 'm/s', 'stom', 's', 'str', 'ss', 'sygn', 's', 'św', 'śp', 'św', 's', 'tab', 'tab', 't', 't', 'tj', 't', 'ub. m', 'ub. r', 'ukr', 'ul', 'v', 'vs', 'v', 'v', 'v.v', 'v', 'zob', 'ob', 'p', 'wg', 'v', 'l', 'w.d', 'w.g', 'wł', 'V', 'wsch', 'wsp', 'wsp', 'wydz', 'wyj', 'wyj', 'wym', 'wym', 'ww', 'wyż. wym', 'x', 'x', 'yd', 'zach', 'za gr', 'zagr', 'zagr', 'fot', 'zł', 'zł', 'zob', 'ob', 'p', 'zool', 'żart', 'żeń', 'źr', 'źr', 'tzw', 'poz'];

function sanitizeText(inputString)
{
    inputString.replace(new RegExp('\s', 'g'), ' ');
    for (i = 0; i < abbvs.length; i++) {
        prefixes = [' ', '('];
        sufixes = ['. ', '.,', '.:', '.;', ' ', ',', ':', ';'];
        for (j = 0; j < prefixes.length; j++)
            for (k = 0; k < sufixes.length; k++)
                inputString = inputString.replace(new RegExp(escapeRegExp(prefixes[j] + abbvs[i] + sufixes[k]), 'gi'), ' ');
    }
    inputString = inputString.replace(new RegExp('\n', 'g'), '. ');

    return inputString;
}

function sanitizeAndSplitSentences(inputString)
{
    sanitizedText = sanitizeText(inputString);
    tab = sanitizedText.split('. ');
    for (i = 0; i < tab.length; i++)
        tab[i] = tab[i].trim();
    tab = tab.filter(function (s) { return s.length > 20 });
    return tab;
}

function escapeRegExp(str) {
    return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}