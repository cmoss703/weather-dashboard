$(document).ready(function () {

    function currentTime() {
        $('#current-day').html(moment().format('llll') + " CST");
    };
    currentTime();
    setInterval(function () {
        currentTime();
    }, 1000);

    var city;
    var cityNum = localStorage.length;
    var lat;
    var lon;
    const APIkey = "9a01a6d9d70a31597772c3b431a80849"

    // If the user has searched for a city in the past, the information is taken from local storage and filled into the weather data function.

    if (localStorage.length !== 0) {

        getLast(city);

    };

    function getLast(city) {

        var lastSearch = localStorage.getItem("last-city");

        city = lastSearch;

        getWeatherdata(city)

    };

    // If the user has any stored cities, they will appear as buttons to the side of the page, under the search bar.

    function cityButtons() {

        for (var j = 0; j < localStorage.length; j++) {

            var prevCity = localStorage.getItem(j);

            if (prevCity !== null) {

                var cityButton = $("<button>").text(prevCity).addClass("city-button");
                $("#buttons").append(cityButton);

            }

        }
    };

    cityButtons();

    // When a city button is clicked, that city is used in the weather data functions.

    $(".city-button").on("click", function () {

        city = $(this).text();

        console.log("clicked " + city);

        getWeatherdata(city)
    });

    // when a user enters a new city, it is entered into the weather data function

    $("#search-btn").on("click", function () {

        city = $("#search-city").val();

        getWeatherdata(city);

    });

    // this is the weather data function. It will clear any data that is currently in the dashboard and use an AJAX call to get weather from
    // the open weather map API. 

    function getWeatherdata(city) {

        $("#dashboard").html('');
        $("#5-day").html('');

        queryURL1 = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIkey;

        console.log(city);
        console.log(queryURL1);

        $.ajax({
            url: queryURL1,
            method: "GET"
        }).then(function (response) {
            console.log(response);

            // most of the elements are created dynamically here, within the ajax function, and appended to the dashboard.

            const pToday = moment().format('L')
            weatherIcon = $("<img>").attr("src", "https://openweathermap.org/img/w/" + response.weather[0].icon + ".png")
            hCity = $("<h2>").text(response.name + " (" + pToday + ")")
            tempF = (response.main.temp - 273.15) * 1.80 + 32
            pTemp = $("<p>").text("Temperature: " + tempF.toFixed(0) + " \u00B0F")
            pHumid = $("<p>").text("Humidity: " + response.main.humidity + " %")
            pWind = $("<p>").text("Wind Speed: " + response.wind.speed + " MPH");

            $("#dashboard").append(hCity, weatherIcon, pTemp, pHumid, pWind);

            // the latitude and longitude coordinates are noted and stored for use later in the UV index and forecast function.

            lat = response.coord.lat;
            lon = response.coord.lon;

            // the last searched city will be stored and used when the user reloads the page. see above getLast(city) function.

            localStorage.setItem("last-city", city);

            // The city is also stored as a button to the side when it is searched, if it does not already exist.

            if ((localStorage.getItem(cityNum - 1) !== city) && (localStorage.getItem(cityNum - 2) !== city) && (localStorage.getItem(cityNum - 3) !== city)) {

                localStorage.setItem(cityNum, city);

                cityNum++;

                var cityButton = $("<button>").text(city).addClass("city-button");
                $("#buttons").append(cityButton);

            };

            // the UV function is called with latitude and longitude as arguments

            getUVdaily(lat, lon);

        })

        // If a city does not exist or cannot be found in the API, an error alert is called.

            .fail(function (error) { alert("Sorry! We couldn't find that city. Please try again.") });

    };

    // This function is called to get UV data as well as 5 day forecast information. It uses latitude and longitude to identify the API,
    // instead of city name, so these are taken from the above function.

    function getUVdaily(lat, lon) {

        console.log("Lat = " + lat + " & Lon = " + lon);

        queryURL2 = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&appid=" + APIkey;

        console.log(queryURL2);

        $.ajax({
            url: queryURL2,
            method: "GET"
        }).then(function (response) {

            console.log(response);

            const uvIndex = response.current.uvi

            const pUV = $("<p><span>").text("UV Index: " + uvIndex)
            fiveDay = response.daily
            forecastText = $("<h3>").text("5-Day Weather Forecast:")

            $("#dashboard").append(pUV);
            $("#dashboard").append(forecastText);

            // Again, most of the information is created dynamically within the ajax function.

            for (var i = 0; i < 5; i++) {

                const dayColumn = $("<div>").addClass("col-md-2")
                dayCard = $("<div>").addClass("card day-col")
                dayCardbody = $("<div>").addClass("card-body").html(response.daily[i])
                date = $("<p>").text(moment().add(i + 1, 'days').format('l'))
                iconDaily = $("<img>").attr("src", "https://openweathermap.org/img/w/" + response.daily[i].weather[0].icon + ".png")
                tempF = (response.daily[i].temp.day - 273.15) * 1.80 + 32
                tempDaily = $("<p>").text("Temp: " + tempF.toFixed(0) + "\u00B0F")
                humidDay = $("<p>").text("Humidity: " + response.daily[i].humidity + "%")

                dayColumn.append(dayCard.append(dayCardbody.append(date, iconDaily, tempDaily, humidDay)));
                $("#5-day").append(dayColumn);

            };

            // The UV index is colorized based on favorable, unfavorable, or moderate conditions.

            if (uvIndex < 4) {
                pUV.addClass("favUV")
            } else if (uvIndex > 5) {
                pUV.addClass("unfavUV")
            } else {
                pUV.addClass("modUV")
            };


        });

    };

})