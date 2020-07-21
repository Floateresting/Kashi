var timer;
var longpress = false;
var delay = 500;
var $lyric = $('#lyric');

function changeLrc(text, kanji_as_rb=true) {
    // add '<br>' at end of each verse
    text = text.replace(/\n/g, '<br>\n');
    // convert kanji+furigana to ruby
    text = text.replace(/([\u3005\u4e00-\u9faf]+)\(([\u3040-\u309f]+)\)/g,
                        kanji_as_rb
                        ? '<ruby><rb>$1</rb><rt>$2</rt></ruby>'
                        : '<ruby><rb> $2 </rb><rt>$1</rt></ruby>');
    $lyric.html(text);
    $('ruby').mouseup(function(){clearTimeout(timer);})
        .mousedown(function(){
            var el = this;
            timer = window.setTimeout(function(){
                $(el).find('rt')[0].classList.toggle('hidden');
            },delay);
        });
}

function toggleRt(){
    $(this).find('rt')[0].classList.toggle('hidden');
}

window.onload = function() {
	$.getJSON('lyrics/data.json', function (data) {
        // for(let song of data){
        for(const [file, title] of Object.entries(data)){
            $('#menu').prepend(
                $('<a>').attr('href',`#${file}`)
                    .text(title)
                    .mouseup(function(){
                        clearTimeout(timer);
                        // if the 'mousedown' was not a longpress
                        if(!longpress){
                            // if clicked on seleted song
                            if(this.classList.contains('selected')){
                                $lyric[0].classList.toggle('no-rt');
                                $('rt').each(function() {
                                    if($lyric[0].classList.contains('no-rt')){
                                        this.classList.add('hidden');
                                    }else{
                                        this.classList.remove('hidden');
                                    }
                                });
                            }else{
                                // remove all 'selected' class
                                $('a').attr('class','');
                                // add 'selected' class to current element
                                this.classList.add('selected');
                                // clear #lyric's class
                                $('#lyric').attr('class','');
                                // get file path
                                $.get('lyrics/'+this.hash.slice(1), function(lyric){
                                    changeLrc(lyric);
                                });
                            }
                        }
                        longpress = false;
                    })
                    .mousedown(function(){
                        timer = window.setTimeout(function(){
                            longpress = true;
                            $lyric[0].classList.toggle('kanji-on-furigana');
                            $.get('lyrics/'+window.location.hash.slice(1), function(lyric){
                                // if html contains 'ruby', generate new html without kanji
                                changeLrc(lyric, !$lyric[0]
                                    .classList.contains('kanji-on-furigana'));
                            });
                        },delay);
                    })
            );
            // if url contains hash (preselected lyric)
            if(window.location.hash){
                $(`a[href=${window.location.hash}]`).click();   
            }
        }
	});
}
