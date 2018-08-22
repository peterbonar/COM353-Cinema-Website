var isChrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1;

/*
  As the page loads either set the location cookie to the value in the #location select if a cookie does not already exist...
  Or else set the value in the #location select equal to the value stored in the location cookie...
  (as it has already been determined by the user).
*/
window.onload = function() {
    checkLocationCookie();
    populateHTMLdata();
    //Update the location cookie and movie list each time the #locations select value changes.
    $('#locations').on('change', function() {
        setLocationCookie();
        populateHTMLdata();
    });

    $("#currently-showing").click(function() {
      $('html,body').animate({
        scrollTop: $("#location-selector").offset().top},'slow');
    });
}

function populateHTMLdata() {
    $('#currently-showing-header').replaceWith('<div class="row" id="currently-showing-header"><div class="col-sm-12"><h2>Currently Showing at ' + getCookie('location') + ':</h2></div></div>');
    console.log(getCookie('location'));

    var data = [];
    //Clear the div before updating movies so the movie list is replaced with new movies rather than continually added to
    data.push('<div id="movie-list"></div>');
    $('#movie-list').replaceWith(data);
    data = [];
    $(jsonData).map(function(i, movies) {
        //Map each json movie into an individual object
        jQuery.each(jsonData.movies, function(index, movie) {
            //Initialise flag and arrays that will be used for formatting movie show time details
            var movieDisplayed = false;
            var locations = [];
            var showtimes = [];
            var dates = [];
            var times = [];
            //Map each nested locationShowTime json (nested within movie object) to an individual object
            jQuery.each(movie.locationShowTimes, function(index, locationShowTime) {
                //Add each location for which the film is shown to the "locations" array
                locations.push(locationShowTime.location);
                //Only display movie if it plays at the location selected by the user
                if (((getCookie('location') == locationShowTime.location) || isChrome)) {
                    //Only format and display the content below if the movie isn't already displayed on the page
                    if (!movieDisplayed) {
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
                        //Set this flag to true to ensure that no movie details are duplicated
                        movieDisplayed = true;
                    }
                    //Store the json array of date and times for each movie to the "showtimes" variable
                    showtimes = locationShowTime.showing;
                    for (var i = 0; i < showtimes.length; i++) {
                        //Only display/return the matching dates and times for a film for the location which is currently selected by the user
                        if ((getCookie('location') == locationShowTime.location)) {
                            var datetime = showtimes[i];
                            dates.push(datetime.date);
                            times.push(datetime.time);
                        }
                    }
                }
            });
            //Only output the information for a film's available locations, dates and times if it is showing at a location selected by the user
            if (locations.indexOf(getCookie('location')) > -1) {
                data.push('<p>Location: ' + locations + '</p>');
                //Output screening dates to the user
                data.push('<ul class="' + movie.title + '-screening-dates">' + getDatesForFilmAsString(movie, dates) + '</ul>');
                //Output screening times to the user
                data.push(getTimesForDateAsString(movie, dates, times));
                //Output available screening locations to the user
                data.push(
                    '</th>' +
                    '</tr>');
            }
        });
    });
    //Push the array of HTML formatted movies to the 'movieList' Div in index.html
    $('#movie-list').append(data);
}

function getDatesForFilmAsString(movie, dates) {
    //Initialise variable to be returned
    var datesToDisplay = "";

    //For each date on which the film is shown add a list and anchor tag to the screen. The id for the anchor tag is comprised of the movie name and the date on which it is shown, thus making it unique.
    //When the anchor tag (shown as a date to the user) is clicked it will call the displayTimesForDate() function
    for (var i = 0; i < dates.length; i++) {
        datesToDisplay += '<li><a class="date-selector" href="javascript:;" id="' + movie.title + '-' + dates[i] + '" onclick="displayTimesForDate(\'' + movie.title + '\', \'' + dates[i] + '\')">' + dates[i] + '</a></li>';
    }
    return datesToDisplay;
}

function getTimesForDateAsString(movie, dates, times) {
    //Initialise variable to be returned by adding initial div with id containing movie name
    var timesToDisplay = '<div id="' + movie.title + '-screening-times">';
    //"times" is an array holding arrays, therefore we loop through each entry and extract these nested arrays into a variable "timesForDate"
    for (var i = 0; i < times.length; i++) {
        var timesForDate = times[i];
        //Appending an inner div
        timesToDisplay += '<div id="' + movie.title + '-' + dates[i] + '-Times">';
        //We then loop through the timesForDate array to extract each individual time on which the film is shown for that date
        for (var j = 0; j < timesForDate.length; j++) {
            //If the time corresponds to the earliest date on which the film is shown then ensure it is displayed upon page load
            if (i == 0) {
                timesToDisplay += ('<input type="button" style="display: inline" class="show-times" value="' + timesForDate[j] + '"></input>');
                //Otherwise hide the times from the user initially. (These times will be displayed if the user selects their corresponding date on the page).    
            } else {
                timesToDisplay += ('<input type="button" class="show-times" value="' + timesForDate[j] + '"></input>');
            }
        }
        timesToDisplay += ('</div>');
    }
    timesToDisplay += ('</div>');
    return timesToDisplay;
}

function displayTimesForDate(movieTitle, date) {
    var screeningId = movieTitle + "-screening-times";
    var dateId = movieTitle + '-' + date + "-Times";
    //Hide all other times for a particular film
    $("*[id=\"" + String(screeningId) + "\"]").find(".show-times").css("display", "none");
    //Show the times for a particular film that are linked to the date that the user has selected
    $("*[id=\"" + String(dateId) + "\"]").find("input").css("display", "inline");
}