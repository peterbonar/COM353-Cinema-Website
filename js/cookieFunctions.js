function setLocationCookie() {
    //Determine the location from the option currently selected.
    var location = 'location=' + $('#locations option:selected').text() + ';',
        d = new Date();
    //Set an expiry time of 24 hours from the cookie's creation.
    d.setTime(d.getTime() + (24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString() + ';';
    //Set the location and expiry keys and values.
    document.cookie = location + expires;
};

function setMovieCookie(movie){
  var movie = 'movie=' + movie + ';', d = new Date();
  d.setTime(d.getTime() + (24 * 60 * 60 * 1000));
  var expires = "expires=" + d.toUTCString() + ';';
  document.cookie = movie + expires;
}

function setDateCookie(date){
  var date = 'date=' + date + ';', d = new Date();
  d.setTime(d.getTime() + (24 * 60 * 60 * 1000));
  var expires = "expires=" + d.toUTCString() + ';';
  document.cookie = date + expires;
}

function setTimeCookie(time){
  var time = 'time=' + time + ';', d = new Date();
  d.setTime(d.getTime() + (24 * 60 * 60 * 1000));
  var expires = "expires=" + d.toUTCString() + ';';
  document.cookie = time + expires;
}

function getCookie(cookieKey) {
    //The key of the cookie value we wish to find is passed in e.g. 'location'.
    var cookieIdentifier = cookieKey + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    //Separate the cookie string into an array based on the location of each ';'.
    var cookieArray = decodedCookie.split(';');
    //If a cookie has not yet been set then don't try to determine a value. Instead return ''.
    if (cookieArray != '') {
        //For each element of the stored cookie array determine the key and value e.g. 'location=Antrim'.
        for (var i = 0; i < cookieArray.length; i++) {
            var cookieValue = cookieArray[i];
            //If the requested cookieKey is found then return the value associated with the key.
            if (cookieValue.indexOf(cookieIdentifier) == 0) {
                //It determines the value to be returned by removing the identifier e.g. 'location=' from the key and value
                return cookieValue.substring(cookieIdentifier.length, cookieValue.location);
            }
            else if (cookieValue.indexOf(cookieIdentifier) > 0) {
              return cookieValue.substring(cookieIdentifier.length + 1, cookieValue.location);
            }
        }
    }
    return '';
}

function checkLocationCookie() {
    var location = getCookie('location');
    //If a location has already been selected and saved then set the value in the #locations select to match this location.
    if (location != '') {
        $('#locations').val(location.toLowerCase());
        //Otherwise set the cookie to be the default/currently selected value from the select.
    } else {
        setLocationCookie();
    }
}
