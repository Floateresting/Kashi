
window.onload = function() {
	$.getJSON('lyrics/data.json', function (data) {
        for(let song of data){
            $('#menu').prepend(
                $('<a>').attr('href',`#${song}`)
                        .text(song)
                        .click(function(){
                            $('#lyric').empty();
                            $.get('lyrics/'+this.innerText, function(lyric){
                                // convert txt to html
                                lyric = lyric.replaceAll('\n','<br>\n');
                                lyric = lyric.replace(/([\u4e00-\u9faf]+)\(([\u3040-\u309f]+)\)/g,
                                                '<ruby><rb>$1</rb><rt>$2</rt></ruby>');
                                $('#lyric').html(lyric);
                            });

                        })
            );
        }
	});
}
