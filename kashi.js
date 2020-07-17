
window.onload = function() {
	$.getJSON('lyrics/data.json', function (data) {
        var song = data[0];
        $.get('lyrics/'+song, function(ly){
            // convert txt to html
            ly = ly.replaceAll('\n','<br>\n');
            ly = ly.replace(/([\u4e00-\u9faf]+)\(([\u3040-\u309f]+)\)/g,
                            '<span class="ruby"><span class="rb">$1</span><span class="rt">$2</span></span>');
            $('#lyric').html(ly);
        });
	});
}
