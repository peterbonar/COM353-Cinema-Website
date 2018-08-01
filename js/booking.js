var isChrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1;
var adultSubTotal = 0, studentSubTotal = 0, childSubTotal = 0;

/*
	As the page loads set the value in the #locations select equal to the value stored in the location cookie (as it has already been determined by the user).
	Then update the appropriate booking fields to match the allowed dates, times, etc. for that location.
*/
window.onload = function() {
    checkLocationCookie();
    updateBookingFields();
    $('#locations').on('change', function() {
        setLocationCookie();
        updateBookingFields();
    });
    generateBookingNumber();
    //Provie the user with a reference number upon submitting the form.
    //NOTE: alert used at the minute but this will be changed to use Bootstrap features when styling
    $('#booking-form').submit(function() {
        alert("Thank you, your booking has been processed. Your reference number is " + generateBookingNumber() +".");
    });
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
    return Math.floor(Math.random()*90000) + 10000;
}

function calcuateSubTotalAdult() {
    var x = document.getElementById("adult-quantity").value;
    var y = 6.5;
    adultSubTotal = x * y;
    document.getElementById("adult-subtotal").innerHTML = "£" + adultSubTotal;
    calculateTotal();
}

function calcuateSubTotalStudent() {
    var x = document.getElementById("student-quantity").value;
    var y = 5;
    studentSubTotal = x * y;
    document.getElementById("student-subtotal").innerHTML = "£" + studentSubTotal;
    calculateTotal();
}

function calcuateSubTotalChild() {
    var x = document.getElementById("child-quantity").value;
    var y = 4;
    childSubTotal = x * y;
    document.getElementById("child-subtotal").innerHTML = "£" + childSubTotal;
    calculateTotal();
}

function calculateTotal(){
  var total = adultSubTotal + studentSubTotal + childSubTotal;
  document.getElementById("total-price").innerHTML = "£" + total;
}


