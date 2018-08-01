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
    var htmlString = ' characters remaining';
    var charactersLeft = fieldLimit - $('#enquiry').val().length;
    $('#characters-remaining').hide();
    $('#characters-remaining').val(charactersLeft + htmlString);
    $('#characters-remaining').css("color","green");
    $(':input[type="submit"]').prop('disabled', true);

    $('#enquiry').keyup(function(){
        var charactersLeft = fieldLimit - $('#enquiry').val().length;
        $('#characters-remaining').val(charactersLeft + htmlString);
        if ($('#enquiry').val().length == 0){
          $('#characters-remaining').hide();
        }else{
          $('#characters-remaining').show();
        }
        if ( $('#enquiry').val().length >= fieldLimit * 0.9) {
          $('#characters-remaining').css("color","orange");
          if ( $('#enquiry').val().length >= fieldLimit * 0.95) {
            $('#characters-remaining').css("color","red");
          }
        }else {
          $('#characters-remaining').css("color","green");
        }
    })

    $('#contact-form *').keyup(function(){
      var allInputs = $('#contact-form *');
      var counterForEmptyFields = 0;
      for(var i = 0; i < allInputs.length; i++){
        if(allInputs[i].value == ""){
          if(allInputs[i].required == true){
            counterForEmptyFields++;
          }
        }
      }
      if(counterForEmptyFields > 0){
        $(':input[type="submit"]').prop('disabled', true);
      }else{
        $(':input[type="submit"]').prop('disabled', false);
      }
    })
};
