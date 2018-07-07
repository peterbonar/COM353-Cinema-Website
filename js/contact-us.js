$('#contact-form').submit(function(){
    var contactMethodSelected = $('#preferred-contact-method-checkboxes :checkbox:checked').length;

    //If no checkbox has been checked then alert the user and prevent form submission. This will ensure at least one checkbox is checked.
    //NOTE: Using alert at the minute, this will be replaced with something like Bootstrap pop-over
    if (contactMethodSelected === 0){
        alert('Please specify at least one preferred contact method');
        return false;
    }
})