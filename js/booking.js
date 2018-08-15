var isChrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1;
var adultSubTotal = 0, studentSubTotal = 0, teenSubTotal = 0, childSubTotal = 0;

/*
	As the page loads set the value in the #locations select equal to the value stored in the location cookie (as it has already been determined by the user).
	Then update the appropriate booking fields to match the allowed dates, times, etc. for that location.
*/
window.onload = function() {
   checkLocationCookie();
   updateBookingFields();
   if (getMovieCookie() != ''){
     setMovieBasedOnCookie();
   }
   if (getLocationCookie() != ''){
     setLocationBasedOnCookie();
   }
   if (getTimeCookie() != ''){
     setTimeBasedOnCookie();
   }
   if ( getDateCookie() != ''){
     setDateBasedOnCookie();
   }
   $('#locations').on('change', function() {
      setLocationCookie();
      updateBookingFields();
   });
   //Populate the quantity dropdown with values from 0 to 20
   //If a user wants to book any more than 20 of any ticket type they have to call up to book
   populateQuantityDropdown();
   //Calculate the subtotal of tickets when the relevant quantity dropdown is changed
   $('#adult-quantity').on('change', function() {
       calcuateSubTotalAdult();
   });
   $('#student-quantity').on('change', function() {
       calcuateSubTotalStudent();
   });
   $('#teen-quantity').on('change', function() {
       calcuateSubTotalTeen();
   });
   $('#child-quantity').on('change', function() {
       calcuateSubTotalChild();
   });
   //Provie the user with a reference number upon submitting the form.
   //NOTE: alert used at the minute but this will be changed to use Bootstrap features when styling
   $('#booking-form').submit(function() {
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
      alert("Thank you, your booking has been processed. Your reference number is " + generateBookingNumber() + ".");
   });

   $(':input[type="submit"]').prop('disabled', true);

   $('#booking-form *').keyup(function() {
      var allInputs = $('#booking-form *');
      var counterForEmptyFields = 0;
      for (var i = 0; i < allInputs.length; i++) {
         if (allInputs[i].value == "") {
            if (allInputs[i].required == true) {
               counterForEmptyFields++;
            }
         }
      }
      if (counterForEmptyFields > 0) {
         $(':input[type="submit"]').prop('disabled', true);
      } else {
         $(':input[type="submit"]').prop('disabled', false);
      }
   })
}

function updateBookingFields() {
   var data = [];
   //Clear the select before updating the film names so the that the select is replaced with new film names rather than continually added to
   data.push('<select id="movie-title" name="movie-title"></select>');
   $('#movie-title').replaceWith(data);
   data = [];
   $(jsonData).map(function(i, movies) {
      //Map each json movie into an individual object
      jQuery.each(jsonData.movies, function(index, movie) {
         //Only display the film-name if it plays at the location selected by the user
         if (jQuery.inArray(getCookie('location'), movie.locations) !== -1 || isChrome) {
            //Format each movie object to HTML and append to the film-name select as an option
            data.push('<option value="' + movie.title.toLowerCase + '"> ' + movie.title + '</option>');
         }
      });
   });
   $('#movie-title').append(data);
}

function generateBookingNumber() {
   //Generate a random 5 digit booking number
   return Math.floor(Math.random() * 90000) + 10000;
}

function calcuateSubTotalAdult() {
   //Get the value of the adult-quantity dropdown
   var x = $('#adult-quantity').val();
   //Get the value of the adult-price label and remove the £ symbol
   var y = ($('#adult-price').text()).replace('£', '');
   //Calculate the subtotal of the adult price
   adultSubTotal = x * y;
   //Set the adult-subtotal as £ plus the value of the subtotal
   $('#adult-subtotal').text("£" + (adultSubTotal).toFixed(2));
   //Update the total price label
   calculateTotal();
}

function calcuateSubTotalStudent() {
   //Get the value of the student-quantity dropdown
   var x = $('#student-quantity').val();
   //Get the value of the student-price label and remove the £ symbol
   var y = ($('#student-price').text()).replace('£', '');
   //Calculate the subtotal of the student price
   studentSubTotal = x * y;
   //Set the student-subtotal as £ plus the value of the subtotal
   // $('#student-subtotal').text("£" + (studentSubTotal).toFixed(2));
   $('#student-subtotal').text("£" + (studentSubTotal).toFixed(2));
   //Update the total price label
   calculateTotal();
}

function calcuateSubTotalTeen() {
   //Get the value of the teen-quantity dropdown
   var x = $('#teen-quantity').val();
   //Get the value of the teen-price label and remove the £ symbol
   var y = ($('#teen-price').text()).replace('£', '');
   //Calculate the subtotal of the teen price
   teenSubTotal = x * y;
   //Set the teen-subtotal as £ plus the value of the subtotal
   $('#teen-subtotal').text("£" + (teenSubTotal).toFixed(2));
   //Update the total price label
   calculateTotal();
}

function calcuateSubTotalChild() {
   //Get the value of the child-quantity dropdown
   var x = $('#child-quantity').val();
   //Get the value of the child-price label and remove the £ symbol
   var y = ($('#child-price').text()).replace('£', '');
   //Calculate the subtotal of the child price
   childSubTotal = x * y;
   //Set the child-subtotal as £ plus the value of the subtotal
   $('#child-subtotal').text("£" + (childSubTotal).toFixed(2));
   //Update the total price label
   calculateTotal();
}

function calculateTotal(){
   //Calculate the total price of all types of tickets
   var total = adultSubTotal + studentSubTotal + teenSubTotal + childSubTotal;
   //Set the value of the total-price label to the total price of tickets
   $('#total-price').text("£" + (total).toFixed(2));
}

function populateQuantityDropdown() {
   var select = '';
   for (i=0;i<=20;i++){
      //Add the 'option' value to the 'select' from 0 to 20
      select += '<option value=' + i + '>' + i + '</option>';
   }
   //Populate each of the quantity drop downs with the select from 0 to 20
   $('#adult-quantity').html(select);
   $('#student-quantity').html(select);
   $('#teen-quantity').html(select);
   $('#child-quantity').html(select);
}

function getMovieCookie(){
  return getCookie('movie');
}

function setMovieBasedOnCookie(){
  var movie = getCookie('movie');
  $('#movie-title').val(movie).change();
  $('#movie-title').attr("disabled", true);
}

function getLocationCookie(){
  return getCookie('location');
}

function setLocationBasedOnCookie(){
  var location = getCookie('location');
  $('#locations select').val(location);
  $('#locations').attr("disabled", true);
}

function getDateCookie(){
  return getCookie('date');
}

function setDateBasedOnCookie(){
  var date = getCookie('date');
  $('#date').val(date).change();
  $('#date').attr("disabled", true);
}

function getTimeCookie(){
  return getCookie('time');
}

function setTimeBasedOnCookie(){
  var time = getCookie('time');
  $('#time').val(time).change();
  $('#time').attr("disabled", true);
}
