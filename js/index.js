$(document.body).change(function() {

    var locationSelect = $(this).children(':selected').val();
    
    document.setCookie = locationSelect;
    console.log(locationSelect);
    console.log(document.cookie);

    $('').each(function() {
        if ($(this).text() == locationSelect) {
            $('').hide();
            $(this).parent().show();
        }
    });
});
