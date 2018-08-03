var isChrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1;

/*
  As the page loads either set the location cookie to the value in the #location select if a cookie does not already exist...
  Or else set the value in the #location select equal to the value stored in the location cookie...
  (as it has already been determined by the user).
*/
window.onload = function() {
    checkLocationCookie();
    populateHTMLMovieData();
    //Update the location cookie and movie list each time the #locations select value changes.
    $('#locations').on('change', function() {
        setLocationCookie();
        populateHTMLMovieData();
    });
    $('#genre-list').on('change', function() {
        setLocationCookie();
        populateHTMLMovieData();    
    });
}

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
        if ($('#genre-list').val() != 'select-genre') {
          //Genre filter set therefore display all movies by location if they are also that genre
          var movieGenres = movie.genre;
          var selectedGenre = $('#genre-list').val();
          if (movieGenres.indexOf(selectedGenre) != -1 ) {
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
            '<p><a href="' + movie.trailer + '" target="_blank">Trailer: ' + movie.title + '</a></p>' +
            '<p>Locations: ' + movie.locations + '</p>' +
            '</th>' +
            '</tr>');
          }
        } else {
          //Genre filter not set therefore display all movies by location only
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
            '<p><a href="' + movie.trailer + '" target="_blank">Trailer: ' + movie.title + '</a></p>' +
            '<p>Locations: ' + movie.locations + '</p>' +
            '</th>' +
            '</tr>');
        }
      }
    });
  });
  //Push the array of HTML formatted movies to the 'movieList' Div in index.html
  $('#movie-list').append(data);
  if (data == "") {
    var message = 'There are no movies that match your search criteria.'
    $('#no-films-for-criteria').text(message)
  } else {
    $('#no-films-for-criteria').text("")
  }
}
