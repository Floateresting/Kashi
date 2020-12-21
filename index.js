"use strict";
var HTMLClass;
(function (HTMLClass) {
    HTMLClass["NoRT"] = "no-rt";
    HTMLClass["Hidden"] = "hidden";
    HTMLClass["Underline"] = "underline";
})(HTMLClass || (HTMLClass = {}));
var switches = {
    '⇅': '⇵',
    '⇵': '⇅',
};
var toggles = {
    '👁': 'ー',
    'ー': '👁',
};
var dir = 'lyrics/';
var $toc = $('#toc');
var $lrc = $('#lrc');
/**
 * create an <a> element for the table of contents
 * @param file path of the .lrc file
 * @param title title of the song
 */
function toc(file, title) {
    return $('<a></a>')
        .attr('href', "#" + title)
        .text(title)
        .on('click', function () { return $.get(dir + file, function (l) { return lrc(l); }); });
}
function lrc(l) {
    // create ruby
    l = l.replace(/([\u3005\u4e00-\u9faf]+)\(([\u3040-\u309f]+)\)/g, '<ruby><rb>$1</rb><rt>$2</rt></ruby>');
    $lrc.html(l);
    $('ruby').on('click', function () {
        $(this).find('rt').toggleClass(HTMLClass.Hidden);
    });
}
$.getJSON(dir + 'data.json').done(function (data) {
    for (var _i = 0, _a = Object.entries(data); _i < _a.length; _i++) {
        var _b = _a[_i], file = _b[0], title = _b[1];
        $toc.prepend(toc(file, title));
    }
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
        var $this = $(this);
        // switch the texts
        var _a = this.innerText.split('\n'), rb = _a[0], rt = _a[1];
        // rb will be underlined when rb is furigana
        // 'rb' and 'rt' stand for 'ruby base' and 'ruby top' ?
        $this.find('rb').text(rt).toggleClass(HTMLClass.Underline);
        $this.find('rt').text(rb);
    });
});
