var adultSubTotal = 0, studentSubTotal = 0, teenSubTotal = 0, childSubTotal = 0;

/*
	As the page loads set the value in the #locations select equal to the value stored in the location cookie (as it has already been determined by the user).
	Then update the appropriate booking fields to match the allowed dates, times, etc. for that location.
*/
window.onload = function() {
   checkLocationCookie();
   updateBookingFields();
   if (getCookie('location') != ''){
     setLocationBasedOnCookie();
     setMovieDateOptionsBasedOnMovieTitleAndLocation(getCurrentlySelectedMovieTitle());
     setMovieTimeOptionsBasedOnMovieTitleAndDateAndLocation(getCurrentlySelectedMovieTitle());
   }
   $('#locations').on('change', function() {
      setCookiesNull();
      setLocationCookie();
      updateBookingFields();
      setMovieDateOptionsBasedOnMovieTitleAndLocation(getCurrentlySelectedMovieTitle());
      setMovieTimeOptionsBasedOnMovieTitleAndDateAndLocation(getCurrentlySelectedMovieTitle());
   });
   $(document).on('change', '#movie-title', function() {
      setCookiesNull();
      setMovieDateOptionsBasedOnMovieTitleAndLocation(getCurrentlySelectedMovieTitle());
      setMovieTimeOptionsBasedOnMovieTitleAndDateAndLocation(getCurrentlySelectedMovieTitle());
   });
   $(document).on('change', '#date', function() {
      setCookiesNull();
      setMovieTimeOptionsBasedOnMovieTitleAndDateAndLocation(getCurrentlySelectedMovieTitle());
   });
   //Populate the quantity dropdown with values from 0 to 20
   //If a user wants to book any more than 20 of any ticket type they have to call up to book
   populateQuantityDropdown();
   //Calculate the subtotal of tickets when the relevant quantity dropdown is changed
   $('#adult-quantity').on('change', function() {
       calculateTicketPriceTotals();
   });
   $('#student-quantity').on('change', function() {
       calculateTicketPriceTotals();
   });
   $('#teen-quantity').on('change', function() {
       calculateTicketPriceTotals();
   });
   $('#child-quantity').on('change', function() {
       calculateTicketPriceTotals();
   });
   //Provide the user with a reference number upon submitting the form.
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
   });
}

function updateBookingFields() {
   var movieTitleData = [];
   //Clear the select before updating the film names so the that the select is replaced with new film names rather than continually added to
   movieTitleData.push('<select id="movie-title" name="movie-title" class="form-field"></select>');
   $('#movie-title').replaceWith(movieTitleData);
   $(jsonData).map(function(i, movies) {
      //Map each json movie into an individual object
      jQuery.each(jsonData.movies, function(index, movie) {
        var locations = [];
        for (i = 0; i < movie.screeningDatesAndTimesByLocation.length; i++) {
            locations.push(movie.screeningDatesAndTimesByLocation[i].location);
        }
        //Only display the film-name if it plays at the location selected by the user
        if (jQuery.inArray(getCookie('location'), locations) !== -1 || isChrome) {
           //Format each movie object to HTML and append to the film-name select as an option
           movieTitleData.push('<option value="' + movie.title + '"> ' + movie.title + '</option>');
        }
      });
   });
   $('#movie-title').append(movieTitleData);
   if (getCookie('movie') != '') {
     setMovieBasedOnCookie();
   }
}

function generateBookingNumber() {
   //Generate a random 5 digit booking number
   return Math.floor(Math.random() * 90000) + 10000;
}

function calculateTicketPriceTotals() {
   var x, y, total = 0;
   //Get the value of the adult-quantity dropdown
   x = $('#adult-quantity').val();
   //Get the value of the adult-price label and remove the £ symbol
   y = ($('#adult-price').text()).replace('£', '');
   //Calculate the subtotal of the adult price
   adultSubTotal = x * y;
   //Set the adult-subtotal as £ plus the value of the subtotal
   $('#adult-subtotal').text("£" + (adultSubTotal).toFixed(2));

   //Get the value of the student-quantity dropdown
   x = $('#student-quantity').val();
   //Get the value of the student-price label and remove the £ symbol
   y = ($('#student-price').text()).replace('£', '');
   //Calculate the subtotal of the student price
   studentSubTotal = x * y;
   //Set the student-subtotal as £ plus the value of the subtotal
   // $('#student-subtotal').text("£" + (studentSubTotal).toFixed(2));
   $('#student-subtotal').text("£" + (studentSubTotal).toFixed(2));

   //Get the value of the teen-quantity dropdown
   x = $('#teen-quantity').val();
   //Get the value of the teen-price label and remove the £ symbol
   y = ($('#teen-price').text()).replace('£', '');
   //Calculate the subtotal of the teen price
   teenSubTotal = x * y;
   //Set the teen-subtotal as £ plus the value of the subtotal
   $('#teen-subtotal').text("£" + (teenSubTotal).toFixed(2));

   //Get the value of the child-quantity dropdown
   x = $('#child-quantity').val();
   //Get the value of the child-price label and remove the £ symbol
   y = ($('#child-price').text()).replace('£', '');
   //Calculate the subtotal of the child price
   childSubTotal = x * y;
   //Set the child-subtotal as £ plus the value of the subtotal
   $('#child-subtotal').text("£" + (childSubTotal).toFixed(2));

   //Calculate the total price of all types of tickets
   total = adultSubTotal + studentSubTotal + teenSubTotal + childSubTotal;
   //Set the value of the total-price label to the total price of tickets
   $('#total-price').text("£" + (total).toFixed(2));
}

function populateQuantityDropdown() {
   var select = '';
   for (i = 0; i <= 20; i++) {
      //Add the 'option' value to the 'select' from 0 to 20
      select += '<option value=' + i + '>' + i + '</option>';
   }
   //Populate each of the quantity drop downs with the select from 0 to 20
   $('#adult-quantity').html(select);
   $('#student-quantity').html(select);
   $('#teen-quantity').html(select);
   $('#child-quantity').html(select);
}

function setMovieDateOptionsBasedOnMovieTitleAndLocation(movieTitle) {
  var dates = [];
  dates.push('<select id="date" name="date" class="form-field"></select>');
  $('#date').replaceWith(dates);
  $(jsonData).map(function(i, movies) {
    jQuery.each(jsonData.movies, function(index, movie) {
      if (movieTitle === movie.title) {
        for (locationIndex = 0; locationIndex < movie.screeningDatesAndTimesByLocation.length; locationIndex++) {
          if ($('#locations').find(":selected").text().trim() === movie.screeningDatesAndTimesByLocation[locationIndex].location) {
            for (screeningIndex = 0; screeningIndex < movie.screeningDatesAndTimesByLocation[locationIndex].screening.length; screeningIndex++) {
              dates.push(getDataInHTMLOptionStringFormat(movie.screeningDatesAndTimesByLocation[locationIndex].screening[screeningIndex].date));
            }
          }
        }
      }
    });
  });
  $('#date').append(dates);
  if (getCookie('date') != '') {
    setDateBasedOnCookie();
  }
}

function setMovieTimeOptionsBasedOnMovieTitleAndDateAndLocation(movieTitle) {
  var times = [];
  times.push('<select id="time" name="time" class="form-field"></select>');
  $('#time').replaceWith(times);
  $(jsonData).map(function(i, movies) {
    jQuery.each(jsonData.movies, function(index, movie) {
      if (movieTitle === movie.title) {
        for (locationIndex = 0; locationIndex < movie.screeningDatesAndTimesByLocation.length; locationIndex++) {
          if ($('#locations').find(":selected").text().trim() === movie.screeningDatesAndTimesByLocation[locationIndex].location) {
            for (screeningIndex = 0; screeningIndex < movie.screeningDatesAndTimesByLocation[locationIndex].screening.length; screeningIndex++) {
              if ($('#date').find(":selected").text().trim() === movie.screeningDatesAndTimesByLocation[locationIndex].screening[screeningIndex].date) {
                for (timeIndex = 0; timeIndex < movie.screeningDatesAndTimesByLocation[locationIndex].screening[screeningIndex].time.length; timeIndex++) {
                  times.push(getDataInHTMLOptionStringFormat(movie.screeningDatesAndTimesByLocation[locationIndex].screening[screeningIndex].time[timeIndex]));
                }
              }
            }
          }
        }
      }
    });
  });
  $('#time').append(times);
  if (getCookie('time') != '') {
    setTimeBasedOnCookie();
  }
}

function getDataInHTMLOptionStringFormat(data) {
  return '<option value="' + data + '">' + data + '</option>'
}

function setMovieBasedOnCookie() {
  var movie = getCookie('movie');
  $('#movie-title').val(movie).change();
}

function setLocationBasedOnCookie() {
  var location = getCookie('location');
  $('#locations select').val(location);
}

function setDateBasedOnCookie() {
  var date = getCookie('date');
  $('#date').val(date).change();
}

function setTimeBasedOnCookie() {
  var time = getCookie('time');
  $('#time').val(time).change();
}

function getCurrentlySelectedMovieTitle() {
  return $('#movie-title').find(":selected").text().trim();
}
