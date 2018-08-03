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

    $("#currently-showing").click(function() {
      $('html,body').animate({
        scrollTop: $(".container").offset().top},'slow');
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
        var locations = '';
        for (i = 0; i < movie.locations.length; i++) {
          locations += movie.locations[i]
          if (i != movie.locations.length - 1) {
            locations += ', ';
          }
        }
        //Format each movie object to HTML
        data.push('<div class="col-md-4 mb-3 float-left">' +
          '<img class="img-fluid rounded mb-3 movie-poster" src="' + movie.poster + '" alt="' + movie.title + ' movie poster"></img>' +
          '</div>' +
          '<div class="col-md-8 mb-3 inline-block">' +
          '<h2>' + movie.title +
          '<img class="rating" src="' + movie.rating + '"></img></h2>' +
          '<h5>' + movie.tagline + '</h5>' +
          '<p><b>Synopsis:</b> ' + movie.description + '</p>' +
          '<div><i class="float-left fas fa-users cast-padding"></i><p class="inline-block"> ' + movie.cast + '</p></div>' +
          '<div><i class="float-left fas fa-user fa-padding"></i><p class="inline-block"> ' + movie.director + '</p></div>' +
          '<div><i class="float-left fas fa-bars fa-padding"></i><p class="inline-block"> ' + movie.genre + '</p></div>' +
          '<div><i class="float-left fab fa-youtube youtube-padding"></i><p><a href="' + movie.trailer + '" target="_blank">Trailer</a></p></div>' +
          '<div><i class="float-left fas fa-globe-americas fa-padding"></i><p class="inline-block"> ' + locations + '</p></div>' +
          '</div>' +
          '<hr>');
      }
    });
  });
  //Push the array of HTML formatted movies to the 'movieList' Div in index.html
  $('#movie-list').append(data);
}
