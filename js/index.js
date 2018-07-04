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
});