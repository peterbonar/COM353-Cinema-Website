window.onload = function() {
    $('#contact-form').submit(function() {
        var contactMethodSelected = $('#preferred-contact-method-checkboxes :checkbox:checked').length;

        //If no checkbox has been checked then alert the user and prevent form submission. This will ensure at least one checkbox is checked.
        //NOTE: Using alert at the minute, this will be replaced with something like Bootstrap pop-over.
        if (contactMethodSelected === 0) {
            alert('Please specify at least one preferred contact method');
            return false;
        }

        //Email validation in case 'email' input type isn't supported in the user's browser.
        var emailValue = $('#email').val();
        //This ensures that an '@' is present and has at least one symbol before it.
        var atLoc = emailValue.indexOf("@", 1);
        //This ensures that a '.' is present at least one symbole after the '@'.
        var dotLoc = emailValue.indexOf(".", atLoc + 2);
        //Ensure that there are also at least 2 characters following the '.'
        if ((atLoc > 0) && (dotLoc > 0) && (emailValue.length > dotLoc + 2)) {
            return true;
        } else {
            //NOTE: Using alert at the minute, this will be replaced with something like Bootstrap pop-over.
            alert('Please enter your e-mail address in a valid format');
            return false;
        }
    })

    var fieldLimit = 500;
    $('#characters-used').val(fieldLimit - $('#enquiry').val().length);
    $('#characters-used').css("color","green");
    $('#textarea-limit').css("color","green");

    $('#enquiry').keyup(function(){
        $('#characters-used').val(fieldLimit - $('#enquiry').val().length);
        if ( $('#enquiry').val().length >= fieldLimit * 0.9) {
          $('#characters-used').css("color","orange");
          $('#textarea-limit').css("color","orange");
          if ( $('#enquiry').val().length >= fieldLimit * 0.95) {
            $('#characters-used').css("color","red");
            $('#textarea-limit').css("color","red");
          }
        }else {
          $('#characters-used').css("color","green");
          $('#textarea-limit').css("color","green");
        }
    })
};
