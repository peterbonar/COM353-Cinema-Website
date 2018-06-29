$(document).ready(function() {
	$('#locations').on('change', function() {
 		var location = $('#locations option:selected').text(), expires = new Date();
        
        expires.setTime(expires.getTime() + (1 * 24 * 60 * 60 * 1000));
 		document.cookie = 'location='+location+'; expires='+expires+';';
 		console.log(location);
 		console.log(document.cookie);
	}
 );
});
