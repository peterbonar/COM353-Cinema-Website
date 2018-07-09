function setCookie() {
 	var location = 'location=' + $('#locations option:selected').text()  + ';', d = new Date();
    d.setTime(d.getTime() + (24*60*60*1000));
    var expires = "expires=" + d.toUTCString() + ';';
 	document.cookie = location + expires;

 	//INCORPORATING PREVIOUS METHOD FUNCTIONALITY INTO SetCookie() FOR NOW, IT CAN BE REMOVED OR EXTRACTED BASED ON INTENDED USE
 	$('').each(function() {
        if ($(this).text() == location) {
            $('').hide();
            $(this).parent().show();
        }
    });
};

window.onload = setCookie;

$(document).ready(function() {
	$('#locations').on('change', setCookie);

  console.log('start');
  var json = (function () {
    var json2 = null;
    console.log('1');
    console.log(json2);
    $.ajax({
      'async': false,
      'global': false,
      'url': ./movies.json,
      'dataType': "json",
      'success': function (data) {
        json2 = data;
        console.log('2');
        console.log(json2);
      }
    });
    console.log('3');
    console.log(json2);
    return json2;
  })();

  $(function() {
    var data = [];
    $(json).map(function(i, movie) {
      console.log('4');
      console.log(json);
      console.log('5');
      console.log(movie);
      data.push('<li>'+movie.title+'</li>');
    });
    $('#movieList').append(data);
  })
});
