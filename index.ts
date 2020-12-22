enum HTMLClass {
    NoRT = 'no-rt',
    Hidden = 'hidden',
    Underline = 'underline',
}

//#region constants

const switches: { [id: string]: string; } = {
    '⇅': '⇵',
    '⇵': '⇅',
}
const toggles: { [id: string]: string; } = {
    '👁': 'ー',
    'ー': '👁',
}
//#endregion constants

//#region variables

let path = 'lyrics/'
let $toc = $('#toc');
let $lrc = $('#lrc');
let $toggle = $('#toggle');
let $switch = $('#switch');

//#endregion variables

//#region functions

/**
 * get the first key of a dictionary/object
 */
function init(o: object) {
    return Object.keys(o)[0];
}

/**
 * create an <a> element for the table of contents
 */
function toc(file: string) {
    return $('<a></a>')
        .attr('href', `#${file}`)
        .text(file)
        .on('click', () => {
            let lyric: string | null;
            // if the lyric is in local storage
            if (lyric = localStorage.getItem(file)) {
                lrc(lyric!);
            } else {
                $.get(path + file + '.txt', l => localStorage.setItem(file, l))
                    .done(l => lrc(l));
            }
        });
}

/**
 * add lyrics to $lrc
 */
function lrc(l: string) {
    // reset buttons' symbols to default
    $toggle.text(init(toggles));
    $switch.text(init(switches));

    // create ruby
    $lrc.html(l.replace(/([\u3005\u4e00-\u9faf]+)\(([\u3040-\u309f]+)\)/g,
        '<ruby><rb>$1</rb><rt>$2</rt></ruby>'));
    // hide/show rt when clicked
    $('ruby').on('click', function () {
        $(this).find('rt').toggleClass(HTMLClass.Hidden);
    });
}

//#endregion functions

$.getJSON(path.replace('/', '.json')).done(data =>
    (data as string[]).forEach(file => $toc.prepend(toc(file)))
);

$toggle.text(init(toggles))
    .on('click', function () {
        // switch the symbol
        this.innerText = toggles[this.innerText];
        // toggle rt's visibility
        $('rt').toggleClass(HTMLClass.Hidden);
    });

$switch.text(init(switches))
    .on('click', function () {
        // switch the symbol
        this.innerText = switches[this.innerText];

        $('ruby').each(function () {
            let $this = $(this);
            // switch the texts
            let [rb, rt] = this.innerText.split('\n');
            // rb will be underlined when rb is furigana
            // 'rb' and 'rt' stand for 'ruby base' and 'ruby top' ?
            $this.find('rb').text(rt).toggleClass(HTMLClass.Underline);
            $this.find('rt').text(rb);
        });
    });

$('#to-top').on('click', () => window.scrollTo(0, 0));