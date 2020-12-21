enum HTMLClass {
    NoRT = 'no-rt',
    Hidden = 'hidden',
    Underline = 'underline',
}

const switches: { [id: string]: string; } = {
    '⇅': '⇵',
    '⇵': '⇅',
}
const toggles: { [id: string]: string; } = {
    '👁': 'ー',
    'ー': '👁',
}

let dir = 'lyrics/'
let $toc = $('#toc');
let $lrc = $('#lrc');

/**
 * create an <a> element for the table of contents
 * @param file path of the .lrc file
 * @param title title of the song
 */
function toc(file: string, title: string) {
    return $('<a></a>')
        .attr('href', `#${title}`)
        .text(title)
        .on('click', () => $.get(dir + file, l => lrc(l)));
}

function lrc(l: string) {
    // create ruby
    l = l.replace(/([\u3005\u4e00-\u9faf]+)\(([\u3040-\u309f]+)\)/g,
        '<ruby><rb>$1</rb><rt>$2</rt></ruby>');

    $lrc.html(l);
    $('ruby').on('click', function () {
        $(this).find('rt').toggleClass(HTMLClass.Hidden);
    });
}


$.getJSON(dir + 'data.json').done(function (data) {
    for (const [file, title] of Object.entries(data))
        $toc.prepend(toc(file, title as string));
});

$('#toggle')
    .text(Object.keys(toggles)[0])
    .on('click', function () {
        // switch the symbol
        this.innerText = toggles[this.innerText];
        // toggle rt's visibility
        $('rt').toggleClass(HTMLClass.Hidden);
    });

$('#switch')
    .text(Object.keys(switches)[0])
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
