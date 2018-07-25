var isChrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1;

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
        //It determines the value to be return by removing the identifier e.g. 'location=' from the key and value
        return cookieValue.substring(cookieIdentifier.length, cookieValue.location);
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

/*
	As the page loads either set the location cookie to the value in the #location select if a cookie does not already exist...
	Or else set the value in the #location select equal to the value stored in the location cookie...
	(as it has already been determined by the user).
*/
window.onload = checkLocationCookie;

$(document).ready(function() {
  populateHTMLMovieData();
  //Update the location cookie and movie list each time the #locations select value changes.
  $('#locations').on('change', function() {
    setLocationCookie();
    populateHTMLMovieData();
  })
});

function populateHTMLMovieData() {
  var data = [];
  //Clear the div before updating movies so the movie list is replaced with new movies rather than continually added to
  data.push('<div id="movie-list"></div>');
  $('#movie-list').replaceWith(data);
  data = [];
  $(jsonData).map(function(i, movies) {
    //Map each json movie into an individual object
    jQuery.each(jsonData.movies, function(index, movie) {
      //Only display movie if it plays at the location selected by the user
      if (jQuery.inArray(getCookie('location'), movie.locations) !== -1 || isChrome) {
        //Format each movie object to HTML
        data.push('<tr>' +
          '<th class="movie-poster-container">' +
          '<img src="' + movie.poster + '" class="movie-poster"></img>' +
          '</th>' +
          '<th class="movie-data">' +
          '<h3>' + movie.title + '</h3>' +
          '<h5>' + movie.tagline + '</h5>' +
          '<p>Description: ' + movie.description + '</p>' +
          '<p>Cast: ' + movie.cast + '</p>' +
          '<p>Director: ' + movie.director + '</p>' +
          '<p>Genre: ' + movie.genre + '</p>' +
          '<p>Rating: ' + movie.rating + '</p>' +
          '<p>Locations: ' + movie.locations + '</p>' +
          '</th>' +
          '</tr>');
      }
    });
  });
  //Push the array of HTML formatted movies to the 'movieList' Div in index.html
  $('#movie-list').append(data);
}
