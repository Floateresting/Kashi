enum HTMLClass {
    Selected = 'selected',
    NoRT = 'no-rt',
    Hidden = 'hidden',
}

let dir = 'lyrics/'
let $toc = $('#toc');
let $lrc = $('#lrc');
let $swith = $('#switch');

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


$.getJSON(dir + 'data.json').done(function (data) {
    for (const [file, title] of Object.entries(data))
        $toc.prepend(toc(file, title as string));
});

$swith.on('click', () => $('ruby').each(function () {
    // switch <rb> and <rt> (only the tag names, not innerText)
    this.innerHTML = this.innerHTML.replace(
        /(r[bt])(.+)(r[bt])(.+)(r[bt])(.+)(r[bt])/,
        '$7$2$5$4$3$6$1'
    );
}));