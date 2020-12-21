enum HTMLClass {
    Selected = 'selected',
    NoRT = 'no-rt',
    Hidden = 'hidden',
}

enum Mode {
    Kanji = 'kanji',
    Furigana = 'furigana',
    KanjiFurigana = 'kanji-furigana',
    FuriganaKanji = 'furigana-kanji',
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
        .on('click', { 'file': file }, click);
}

/**
 * toggle furigana or change lyric
 * @param this 
 * @param event 
 */
function click(this: HTMLElement, event: JQuery.ClickEvent) {
    // if clicked on selected song
    if (this.classList.contains(HTMLClass.Selected)) {
        $('rt').toggleClass(HTMLClass.Hidden);
    } else {
        $('a').attr('class', '');
        this.classList.add(HTMLClass.Selected);
        $lrc.attr('class', '');
        $.get(dir + event.data.file, l => lrc(l));
    }
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

$.getJSON(dir + 'data.json')
    .done(function (data) {
        for (const [file, title] of Object.entries(data))
            $toc.prepend(toc(file, title as string));
    });