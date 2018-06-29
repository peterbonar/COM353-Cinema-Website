$('select#locations').change(function() {

    locationSelect = $(this).children(':selected').text();

    $('').each(function() {
        if ($(this).text() == locationSelect) {
            $('').hide();
            $(this).parent().show();
        }
    });
});
