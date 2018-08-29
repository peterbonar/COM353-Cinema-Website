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
            scrollTop: $("#location-selector").offset().top
        }, 'slow');
    });
}

function populateHTMLMovieData() {
    $('#currently-showing-header').replaceWith('<div id="currently-showing-header" class="row"><div class="col-sm-12"><h2 class="index-header">Currently Showing at ' + getCookie('location') + ':</h2><hr></div></div>');

    var data = "";
    //Clear the div before updating movies so the movie list is replaced with new movies rather than continually added to
    data += '<div id="movie-list"></div>';
    $('#movie-list').replaceWith(data);
    data = "";
    $(jsonData).map(function(i, movies) {
        //Map each json movie into an individual object
        jQuery.each(jsonData.movies, function(index, movie) {
            //Initialise flag and arrays that will be used for formatting movie screening details
            var movieDisplayed = false;
            var locations = [];
            var screeningTimes = [];
            var datesAndTimes = {};
            var dates = [];
            //Map each nested screeningDatesAndTimesByLocation json (nested within movie object) to an individual object
            jQuery.each(movie.screeningDatesAndTimesByLocation, function(index, screeningDatesAndTimesByLocation) {
                //Add each location for which the movie is shown to the "locations" array
                locations.push(screeningDatesAndTimesByLocation.location);
                //Only display movie if it plays at the location selected by the user
                if (getCookie('location') == screeningDatesAndTimesByLocation.location) {
                    //Only format and display the content below if the movie isn't already displayed on the page
                    if (!movieDisplayed) {
                        data += getMovieDetailsAsString(movie, locations);
                        //Set this flag to true to ensure that no movie details are duplicated
                        movieDisplayed = true;
                    }
                    //Store the json array of date and times by location for each movie to the "screeningTimes" variable
                    screeningTimes = screeningDatesAndTimesByLocation.screening;
                    for (var i = 0; i < screeningTimes.length; i++) {
                        //Only display/return the matching dates and times for a movie for the location which is currently selected by the user
                        if ((getCookie('location') == screeningDatesAndTimesByLocation.location)) {
                            datesAndTimes[screeningTimes[i].date] = screeningTimes[i].time;
                            dates.push(screeningTimes[i].date);
                        }
                    }
                }
            });
            //Only output the information for a movie's available locations, dates and times if it is showing at a location selected by the user
            if (locations.indexOf(getCookie('location')) > -1) {
                data += getScreeningDataForMovieAsString(movie, dates, datesAndTimes, locations);
            }
        });
    });
    //Push the array of HTML formatted movies to the 'movieList' Div in index.html
    $('#movie-list').append(data);
}

function getMovieDetailsAsString(movie, locations) {
    var movieDetails = '<div class="row">';
    //Format each movie object to HTML
    movieDetails += '<div class="col-md-6 mb-9 float-left">' +
        '<img class="img-fluid rounded mb-9 movie-poster" src="' + movie.poster + '" alt="' + movie.title + ' movie poster"></img>' +
        '</div>' +
        '<div class="col-md-6 mb-3 inline-block">' +
        '<h2>' + movie.title +
        '<img class="rating" src="' + movie.rating + '" alt="' + movie.rating.substring(14, movie.rating.length - 4) + '"></img></h2>' +
        '<h5>' + movie.tagline + '</h5>' +
        '<p><b>Synopsis:</b> ' + movie.description + '</p>' +
        '<div><i class="float-left fas fa-users cast-padding"></i><p class="inline-block"> ' + movie.cast + '</p></div>' +
        '<div><i class="float-left fas fa-user fa-padding"></i><p class="inline-block"> ' + movie.director + '</p></div>' +
        '<div><i class="float-left fas fa-bars fa-padding"></i><p class="inline-block"> ' + movie.genre + '</p></div>' +
        '<div><i class="float-left fab fa-youtube youtube-padding"></i><p><a href="' + movie.trailer + '" target="_blank">Trailer</a></p></div>';
    return movieDetails;
}

function getScreeningDataForMovieAsString(movie, dates, datesAndTimes, locations) {
    //Output available screening locations to the user
    var screeningData = '<div><i class="float-left fas fa-globe-americas fa-padding"></i><p class="inline-block"> ' + locations.join(", ") + '</p></div>';
    //Output screening dates and times to the user
    screeningData += '<div class="float-left"><h5 class="date-time-header">Select a date and time below to book your screening:</h5><p class="date-time-instructions">(Click a date below to see screening times for that date)</p><div id="' +
        movie.title + '-screening-dates-and-times">' +
        getDatesAndTimesForMovieAsString(movie, dates, datesAndTimes) +
        '</div></div></div></div></div></div><hr>';
    return screeningData;
}

function getDatesAndTimesForMovieAsString(movie, dates, datesAndTimes) {
    //Initialise variable to be returned
    var datesToDisplay = "";
    //For each date on which the movie is shown add a button to the screen. The id for the button is comprised of the movie name and the date on which it is shown, thus making it unique.
    //When the button (displaying a date to the user) is clicked it will call the getTimesForMovieAsString() function
    for (var dateCounter = 0; dateCounter < dates.length; dateCounter++) {
        datesToDisplay += '<input type="button" class="btn btn-primary btn-block btn-small" href="javascript:;" id="' + movie.title + '-' + dates[dateCounter] + '" onclick="displayTimesForDate(\'' + movie.title + '\', \'' + dates[dateCounter] + '\');" value="' + dates[dateCounter] + '"></input>';
        datesToDisplay += getTimesForMovieAsString(movie, dates, datesAndTimes, dateCounter);
    }
    datesToDisplay += ('</div>')
    return datesToDisplay;
}

function getTimesForMovieAsString(movie, dates, datesAndTimes, dateCounter) {
    //Store the array of times for the specified date in the datesAndTimes map in 'timesForDate' variable
    var timesForDate = datesAndTimes[dates[dateCounter]];
    //Appending an inner div that will be used for identifying which times to display to the user
    var timesToDisplay = '<div id="' + movie.title + '-' + dates[dateCounter] + '-Times">';
    //For each element in 'timesForDate' append a link/button to the HTML to allow the user to choose this time on a certain date for a specified movie
    for (var timeCounter = 0; timeCounter < timesForDate.length; timeCounter++) {
        if (dateCounter == 0) {
            //Display the times for the most recent date on which the movie is shown by default
            timesToDisplay += ('<a href="./booking.html"><input type="button" href="./booking.html" style="display: inline" onclick="setDateCookie(\'' + dates[dateCounter] + '\'); setTimeCookie(\'' + timesForDate[timeCounter] + '\'); setMovieCookie(\'' + movie.title + '\')" class="btn btn-block screening-times" value="' + timesForDate[timeCounter] + '"></input></a>');
        } else {
            //Otherwise hide the times from the user initially. (These times will be displayed if the user selects their corresponding date on the page)
            timesToDisplay += ('<a href="./booking.html"><input type="button" onclick="setDateCookie(\'' + dates[dateCounter] + '\'); setTimeCookie(\'' + timesForDate[timeCounter] + '\'); setMovieCookie(\'' + movie.title + '\')" class="btn btn-block screening-times" value="' + timesForDate[timeCounter] + '"></input></a>');
        }
    }
    timesToDisplay += ('</div><br>');
    return timesToDisplay;
}

function displayTimesForDate(movieTitle, date) {
    //screeningID is used to locate the div which contains all elements relating to the dates and times on which a specified movie is shown
    var screeningId = movieTitle + "-screening-dates-and-times";
    //dateID is used to locate the div which contains all time-related elements for a screening of a specified movie on a particular date
    var dateId = movieTitle + '-' + date + "-Times";
    //Hide all other times for a particular movie
    $("*[id=\"" + screeningId + "\"]").find("*[id*=\"Times\"]").find("input").css("display", "none");
    //Show the times for a particular movie that are linked to the date that the user has selected
    $("*[id=\"" + String(dateId) + "\"]").find("input").css("display", "block");
}
