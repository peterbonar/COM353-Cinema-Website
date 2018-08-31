var adultSubTotal = 0,
   studentSubTotal = 0,
   teenSubTotal = 0,
   childSubTotal = 0,
   tenPercentDiscountCode = "10",
   twentyPercentDiscountCode = "20",
   discountApplied = false;

/*
As the page loads set the value in the #locations select equal to the value stored in the location cookie (as it has already been determined by the user).
Then update the appropriate booking fields to match the allowed dates, times, etc. for that location.
*/
window.onload = function () {
   checkLocationCookie();
   updateBookingFields();
   if (getCookie('location') != '') {
      setLocationBasedOnCookie();
      setMovieDateOptionsBasedOnMovieTitleAndLocation(getCurrentlySelectedMovieTitle());
      setMovieTimeOptionsBasedOnMovieTitleAndDateAndLocation(getCurrentlySelectedMovieTitle());
   }
   $('#locations').on('change', function () {
      setCookiesNull();
      setLocationCookie();
      updateBookingFields();
      setMovieDateOptionsBasedOnMovieTitleAndLocation(getCurrentlySelectedMovieTitle());
      setMovieTimeOptionsBasedOnMovieTitleAndDateAndLocation(getCurrentlySelectedMovieTitle());
   });
   $(document).on('change', '#movie-title', function () {
      setCookiesNull();
      setMovieDateOptionsBasedOnMovieTitleAndLocation(getCurrentlySelectedMovieTitle());
      setMovieTimeOptionsBasedOnMovieTitleAndDateAndLocation(getCurrentlySelectedMovieTitle());
   });
   $(document).on('change', '#date', function () {
      setCookiesNull();
      setMovieTimeOptionsBasedOnMovieTitleAndDateAndLocation(getCurrentlySelectedMovieTitle());
   });
   //Populate the quantity dropdown with values from 0 to 20
   //If a user wants to book any more than 20 of any ticket type they have to call up to book
   populateQuantityDropdown();
   //Calculate the subtotal of tickets when the relevant quantity dropdown is changed
   $('#adult-quantity').on('change', function () {
      checkForDiscountApplied();
      adultSubTotal = calculatePrice('adult-quantity', 5);
      $('#adult-subtotal').text("£" + (adultSubTotal).toFixed(2));
      displayTotalPrice();
      checkDiscountCodeField();
   });
   $('#student-quantity').on('change', function () {
      checkForDiscountApplied();
      studentSubTotal = calculatePrice('student-quantity', 4);
      $('#student-subtotal').text("£" + (studentSubTotal).toFixed(2));
      displayTotalPrice();
      checkDiscountCodeField();
   });
   $('#teen-quantity').on('change', function () {
      checkForDiscountApplied();
      teenSubTotal = calculatePrice('teen-quantity', 3.5);
      $('#teen-subtotal').text("£" + (teenSubTotal).toFixed(2));
      displayTotalPrice();
      checkDiscountCodeField();
   });
   $('#child-quantity').on('change', function () {
      checkForDiscountApplied();
      childSubTotal = calculatePrice('child-quantity', 2.5);
      $('#child-subtotal').text("£" + (childSubTotal).toFixed(2));
      displayTotalPrice();
      checkDiscountCodeField();
   });
   //Provide the user with a reference number upon submitting the form.
   //NOTE: alert used at the minute but this will be changed to use Bootstrap features when styling
   $('#booking-form').submit(function () {
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
   //When the booking form has data entered, continually check if all required fields have data
   $('#booking-form *').keyup(function () {
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
   disableApplyDiscountButton();
   hideDiscountDetails();
   $('#discount-code').keyup(function () {
      checkDiscountCodeField();
   });
   $('#apply-discount').click(function () {
      discountCheck();
   });
   $('#phone').change(function () {
      var phone = $('#phone').val();
      if (!$.isNumeric(phone) || phone.length != 11) {
         $(':input[type="submit"]').prop('disabled', true);
         alert('Please enter a valid phone number that is 11 numbers long');
         $('#phone').focus();
      }
   });
}

function updateBookingFields() {
   var movieTitleData = [];
   //Clear the select before updating the film names so the that the select is replaced with new film names rather than continually added to
   movieTitleData.push('<select id="movie-title" name="movie-title" class="form-field"></select>');
   $('#movie-title').replaceWith(movieTitleData);
   $(jsonData).map(function (i, movies) {
      //Map each json movie into an individual object
      jQuery.each(jsonData.movies, function (index, movie) {
         var locations = [];
         for (i = 0; i < movie.screeningDatesAndTimesByLocation.length; i++) {
            locations.push(movie.screeningDatesAndTimesByLocation[i].location);
         }
         //Only display the film-name if it plays at the location selected by the user
         if (jQuery.inArray(getCookie('location'), locations) !== -1) {
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

//Function to carry out the application of discount
function discountCheck() {
   var discountCode = getDiscountCodeEntered();
   var discountIsValid = checkIfValidDiscountCode(discountCode);
   if (discountIsValid) {
      var discountPercent = checkDiscountPercentage(discountCode);
      showDiscountDetails(discountPercent);
      displayDiscountPriceOnPage(discountPercent);
      discountApplied = true;
   } else {
      alert('Invalid Discount Code Entered. Please Enter a Valid Discount Code.');
      hideDiscountDetails();
      $('#discount-code').val('');
   }
}

//Check if the discount code entered is valid
function checkIfValidDiscountCode(discountCode) {
   if (discountCode === tenPercentDiscountCode || discountCode === twentyPercentDiscountCode) {
      return true;
   } else {
      return false;
   }
}
//Check what percentage discount to be applied
function checkDiscountPercentage(discountCode) {
   if (discountCode === tenPercentDiscountCode) {
      return 10;
   }
   if (discountCode === twentyPercentDiscountCode) {
      return 20;
   }
}

//Generate random booking number
function generateBookingNumber() {
   //Generate a random 5 digit booking number
   return Math.floor(Math.random() * 90000) + 10000;
}

//Display the total price on page
function displayTotalPrice() {
   var adultSubTotal = calculateAdultSubtotal();
   var childSubTotal = calculateChildSubtotal();
   var studentSubTotal = calculateStudentSubtotal();
   var teenSubTotal = calculateTeenSubtotal();
   var total = adultSubTotal + childSubTotal + studentSubTotal + teenSubTotal;
   $('#total-price').text("£" + ((total).toFixed(2)));
}

//Get the total price of tickets
function getTotalPrice() {
   var adultSubTotal = calculateAdultSubtotal();
   var childSubTotal = calculateChildSubtotal();
   var studentSubTotal = calculateStudentSubtotal();
   var teenSubTotal = calculateTeenSubtotal();
   var total = adultSubTotal + childSubTotal + studentSubTotal + teenSubTotal;
   return total;
}
//Function to calulcate subtotal based on quantity and ticket price
function calculatePrice(quantityId, price) {
   var quantity = $('*[id=' + quantityId + ']').val();
   var subTotal = parseInt(quantity) * parseFloat(price);
   return subTotal;
}

//Calculate adult subtotal
function calculateAdultSubtotal() {
   var adultSubTotal = calculatePrice('adult-quantity', 5);
   return adultSubTotal;
}
//Calculate student subtotal
function calculateStudentSubtotal() {
   var studentSubTotal = calculatePrice('student-quantity', 4);
   return studentSubTotal;
}

//Calculate child subtotal
function calculateChildSubtotal() {
   var childSubTotal = calculatePrice('child-quantity', 2.5);
   return childSubTotal;
}

function calculateTeenSubtotal() {
   var teenSubTotal = calculatePrice('teen-quantity', 3.5);
   return teenSubTotal;
}

//Populate quatity dropdown from 1 to 20
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

//Check discount code field and if there is nothing present, disable button
function checkDiscountCodeField() {
   var discountCodeFieldLength = $('#discount-code').val().length;
   if (discountCodeFieldLength > 0 && getTotalPrice() > 0) {
      $('#apply-discount').prop('disabled', false);
   } else {
      $('#apply-discount').prop('disabled', true);
   }
}

//Get the value of the entered discount code
function getDiscountCodeEntered() {
   var discountCode = $('#discount-code').val();
   return discountCode;
}

//Display the discounted amount
function displayDiscountPriceOnPage(discountPercent) {
   var preDiscountTotal = getTotalPrice();
   var discountAmount = preDiscountTotal * (discountPercent / 100);
   var postDiscountTotal = preDiscountTotal - discountAmount;
   $('#discount-price').text("£" + (postDiscountTotal).toFixed(2));
}

//Hide the discount details
function hideDiscountDetails() {
   $('#discount-percent').hide();
   $('#discount-percent-label').hide();
   $('#discount-total-label').hide();
   $('#discount-price').hide();
   $('#discount-price-label').hide();
   $('#bottom-of-table').hide();
}
//Show the extra discount details with the relevant discount percentage
function showDiscountDetails(discountPercent) {
   $('#discount-percent').text(discountPercent + "%");
   $('#discount-percent').show();
   $('#discount-percent-label').show();
   $('#discount-total-label').show();
   $('#discount-price').show();
   $('#discount-price-label').show();
   $('#bottom-of-table').show();
}
//Disable the apply discount button
function disableApplyDiscountButton() {
   $('#apply-discount').prop('disabled', true);
}

//Enable the apply discount button
function enableApplyDiscountButton() {
   $('#apply-discount').prop('disabled', false);
}

function getMovieCookie() {
   return getCookie('movie');
}

function setMovieBasedOnCookie() {
   var movie = getCookie('movie');
   $('#movie-title').val(movie).change();
}

function getLocationCookie() {
   return getCookie('location');
}

function setLocationBasedOnCookie() {
   var location = getCookie('location');
   $('#locations select').val(location);
}

function getDateCookie() {
   return getCookie('date');
}

function setDateBasedOnCookie() {
   var date = getCookie('date');
   $('#date').val(date).change();
}

function getTimeCookie() {
   return getCookie('time');
}

function setTimeBasedOnCookie() {
   var time = getCookie('time');
   $('#time').val(time).change();
}

function checkForDiscountApplied() {
   if (discountApplied) {
      var reapplyDiscount = confirm('Do you want to reapply discount?');
      if (reapplyDiscount) {
         discountCheck();
      } else {
         displayTotalPrice();
         hideDiscountDetails();
         discountApplied = false;
      }
   }
}

function setMovieDateOptionsBasedOnMovieTitleAndLocation(movieTitle) {
   var dates = [];
   dates.push('<select id="date" name="date" class="form-field"></select>');
   $('#date').replaceWith(dates);
   $(jsonData).map(function (i, movies) {
      jQuery.each(jsonData.movies, function (index, movie) {
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
   $(jsonData).map(function (i, movies) {
      jQuery.each(jsonData.movies, function (index, movie) {
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