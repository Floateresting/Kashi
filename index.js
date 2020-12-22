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
var path = 'lyrics/';
var $toc = $('#toc');
var $lrc = $('#lrc');
var $toggle = $('#toggle');
var $switch = $('#switch');
/**
 * get the first key of a dictionary/object
 */
function init(o) {
    return Object.keys(o)[0];
}
/**
 * create an <a> element for the table of contents
 */
function toc(file) {
    return $('<a></a>')
        .attr('href', "#" + file)
        .text(file)
        .on('click', function () {
        var lyric;
        // if the lyric is in local storage
        if (lyric = localStorage.getItem(file)) {
            lrc(lyric);
        }
        else {
            $.get(path + file + '.txt', function (l) { return localStorage.setItem(file, l); })
                .done(function (l) { return lrc(l); });
        }
    });
}
/**
 * add lyrics to $lrc
 */
function lrc(l) {
    // reset buttons' symbols to default
    $toggle.text(init(toggles));
    $switch.text(init(switches));
    // create ruby
    $lrc.html(l.replace(/([\u3005\u4e00-\u9faf]+)\(([\u3040-\u309f]+)\)/g, '<ruby><rb>$1</rb><rt>$2</rt></ruby>'));
    // hide/show rt when clicked
    $('ruby').on('click', function () {
        $(this).find('rt').toggleClass(HTMLClass.Hidden);
    });
}
$.getJSON(path.replace('/', '.json')).done(function (data) {
    return data.forEach(function (file) { return $toc.prepend(toc(file)); });
});
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
        var $this = $(this);
        // switch the texts
        var _a = this.innerText.split('\n'), rb = _a[0], rt = _a[1];
        // rb will be underlined when rb is furigana
        // 'rb' and 'rt' stand for 'ruby base' and 'ruby top' ?
        $this.find('rb').text(rt).toggleClass(HTMLClass.Underline);
        $this.find('rt').text(rb);
    });
});
$('#to-top').on('click', function () { return window.scrollTo(0, 0); });
