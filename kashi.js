
window.onload = function() {
	$.getJSON('lyrics/data.json', function (data) {
        for(let song of data){
            $('#menu').prepend(
                $('<a>').attr('href',`#${song}`)
                        .text(song)
                        .click(function(){
                            // if clicked on seleted song
                            if(this.classList.contains('selected')){
                                $('rt').each(function() {
                                    this.classList.toggle('hidden');
                                });
                            }else{
                                // remove all 'selected' class
                                $('a').attr('class','');
                                // add 'selected' class to current element
                                this.classList.add('selected');

                                $('#lyric').empty();
                                $.get('lyrics/'+this.innerText, function(lyric){
                                    // convert txt to html
                                    lyric = lyric.replace(/\n/g,'<br>\n');
                                    lyric = lyric.replace(/([\u3005\u4e00-\u9faf]+)\(([\u3040-\u309f]+)\)/g,
                                                    '<ruby><rb>$1</rb><rt>$2</rt></ruby>');
                                    $('#lyric').html(lyric);
                                });
                            }
                        })
            );
        }
	});
}
