const VOWELS = [
    'a', 'an', 'ai', 'au',
    'e', 'ei', 'eu', 'en',
    'i', 'in', 'io',
    'o', 'oi', 'ou', 'on',
    'u', 'un', 'ui',
    'y'
];

const CONSONANTS = [
    'b', 'br', 'bl',
    'c', 'cr', 'ch',
    'd', 'dr',
    'f', 'ff', 'fr', 'fl',
    'g', 'gu', 'gr', 'gl', 'gn',
    'j',
    'k', 'kr',
    'l', 'll', 'lt', 'lg', 'lj', 'lk', 'lm', 'lv', 'lgu', 'lgr',
    'm', 'mm',
    'n', 'nn',
    'p', 'pr', 'ps', 'pl', 'pn', 'pp',
    'q', 'qu',
    'r', 'rt', 'rp', 'rg', 'rd', 'rq', 'rj', 'rgu', 'rgr', 'rgl', 'rgn',
    's', 'ss', 'sl',
    't', 'tr', 'tl', 'th', 'tt',
    'v', 'vr',
    'w',
    'x',
    'y',
    'z', 'zt', 'zj', 'zv'
];

const BLACKLIST = [
    'aiw',
    'eiw',
    'gni', 'guo', 'gua',
    'iow',
    'mz', 'mr', 'mt', 'mq', 'ms', 'md', 'mf', 'mg', 'mh', 'mj', 'mk', 'ml', 'mw', 'mx', 'mc', 'mv', 'mn',
    'nm', 'nw',
    'nb', 'np',
    'oiw', 'ouw', 'onw',
    'uu', 'uw', 'uiw',
    'yy'
];

// TODO: not start with same 2 consonants

const SYLLABES = [VOWELS, CONSONANTS];

const randomBetweenZeroAnd = (max) => {
    return Math.floor(Math.random() * (max + 1));
};

const uuid = (length = 4) => {
    let str = '';
    let startWith = randomBetweenZeroAnd(1);

    while (str.length < length) {
        const remainingLength = length - str.length;

        let pos = randomBetweenZeroAnd(SYLLABES[startWith].length - 1);
        let syllabe = SYLLABES[startWith][pos];

        while (syllabe.length > remainingLength) {
            let pos = randomBetweenZeroAnd(SYLLABES[startWith].length - 1);
            syllabe = SYLLABES[startWith][pos];
        }

        str += syllabe;

        startWith = (startWith + 1) % 2;
    }

    if (new RegExp(BLACKLIST.join("|")).test(str)) {
        return uuid(length);
    }

    return str;
};

const rrs = (length, separatorGap = 0) => {
    if (!separatorGap) {
        return uuid(length);
    }

    let str = '';

    while (str.length < length) {
        str += uuid(separatorGap) + '-';
    }

    return str.slice(0, length);
};

export { rrs };