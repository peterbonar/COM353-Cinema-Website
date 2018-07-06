$('#contact-form').submit(function(){
    var contactMethodSelected = $('#preferred-contact-method-checkboxes :checkbox:checked').length;

    if (contactMethodSelected === 0){
        alert('Please specify at least one preferred contact method');
        return false;
    }
})