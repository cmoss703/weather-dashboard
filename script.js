$(document).ready(function () {

    function currentTime() {
        $('#current-day').html(moment().format('llll'));
    };
    currentTime();
    setInterval(function () {
        currentTime();
    }, 1000);

    var city;
    var cityNum = 0;
    var lat;
    var lon;
    const APIkey = "9a01a6d9d70a31597772c3b431a80849"

    function getLast(city) {

        var lastSearch = localStorage.getItem("last-city");

        city = lastSearch;

        getWeatherdata(city)

    };

    getLast(city);

    // function savedCities() {

    //     for (i = 0; i>)
    // };

    // savedCities();

    $("#search-btn").on("click", function () {

        city = $("#search-city").val();

        $("#dashboard").html('');
        $("#5-day").html('');

        getWeatherdata(city);

    });

    function getWeatherdata(city) {

        queryURL1 = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIkey;

        console.log(city);
        console.log(queryURL1);

        $.ajax({
            url: queryURL1,
            method: "GET"
        }).then(function (response) {
            console.log(response);

            const pToday = moment().format('L')
            weatherIcon = $("<img>").attr("src", "http://openweathermap.org/img/w/" + response.weather[0].icon + ".png")
            hCity = $("<h3>").text(response.name + " (" + pToday + ")")
            tempF = (response.main.temp - 273.15) * 1.80 + 32
            pTemp = $("<p>").text("Temperature: " + tempF.toFixed(0) + " \u00B0F")
            pHumid = $("<p>").text("Humidity: " + response.main.humidity + " %")
            pWind = $("<p>").text("Wind Speed: " + response.wind.speed + " MPH");

            $("#dashboard").append(hCity, weatherIcon, pTemp, pHumid, pWind);

            var cityButton = $("<button>").text(city);
            $("#buttons").append(cityButton);

            lat = response.coord.lat;
            lon = response.coord.lon;

            cityNum++;

            localStorage.setItem("City " + cityNum, city);
            localStorage.setItem("last-city", city);

            getUVdaily(lat, lon);

        });

    };

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

            const pUV = $("<p>").text("UV Index: " + uvIndex)
            fiveDay = response.daily

            $("#dashboard").append(pUV);

            for (var i = 0; i < 5; i++) {

                const dayColumn = $("<div>").addClass("col-md-2")
                dayCard = $("<div>").addClass("card day-col")
                dayCardbody = $("<div>").addClass("card-body").html(response.daily[i])
                date = $("<p>").text(moment().add(i + 1, 'days').format('l'))
                iconDaily = $("<img>").attr("src", "http://openweathermap.org/img/w/" + response.daily[i].weather[0].icon + ".png")
                tempF = (response.daily[i].temp.day - 273.15) * 1.80 + 32
                tempDaily = $("<p>").text("Temp: " + tempF.toFixed(0) + "\u00B0F")
                humidDay = $("<p>").text("Humidity: " + response.daily[i].humidity + "%")

                dayColumn.append(dayCard.append(dayCardbody.append(date, iconDaily, tempDaily, humidDay)));
                $("#5-day").append(dayColumn);

            };

            // if (uvIndex < 4) {
            //     pUV.addClass("favUV")
            // } else if (uvIndex > 5) {
            //     pUV.addClass("unfavUV")
            // } else {
            //     pUV.addClass(modUV)
            // };


        });

    };

    // figure out how to colorize only the UV index number
    // save recent cities to local storage and call them when page reloads

})