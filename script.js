$(document).ready(function () {

    function currentTime() {
        $('#current-day').html(moment().format('llll'));
    };
    currentTime();
    setInterval(function () {
        currentTime();
    }, 1000);

    var city;
    var lat;
    var lon;


    // var citySearch = $(search-city).val()
    //     searchBtn = $(search-btn);

    $("#search-btn").on("click", function (event) {

        event.preventDefault();

        city = $("#search-city").val();
        const APIkey = "9a01a6d9d70a31597772c3b431a80849"
        queryURL1 = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIkey;

        console.log(city);
        console.log(queryURL1);

        $.ajax({
            url: queryURL1,
            method: "GET"
        }).then(function (response) {
            console.log(response);

            const pToday = moment().format('L')
            hCity = $("<h3>").text(response.name + " (" + pToday + ")")
            tempF = (response.main.temp - 273.15) * 1.80 + 32
            pTemp = $("<p>").text("Temperature: " + tempF.toFixed(0) + " \u00B0F")
            pHumid = $("<p>").text("Humidity: " + response.main.humidity + " %")
            pWind = $("<p>").text("Wind Speed: " + response.wind.speed + " MPH");

            $("#dashboard").append(hCity, pTemp, pHumid, pWind);
            $("#city-bar").append(city);

            lat = response.coord.lat;
            lon = response.coord.lon;

            localStorage.setItem("City " + city, city)

            localStorage.setItem("lat " + city, lat);
            localStorage.setItem("lon " + city, lon);

            getUVdaily();

        });

        function getUVdaily() {
        
        lat = localStorage.getItem("lat " + city);
        lon = localStorage.getItem("lon " + city);
        console.log("Lat = " + lat + " & Lon = " + lon);

        queryURL2 = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&appid=" + APIkey;

        console.log(city);
        console.log(queryURL2);

        $.ajax({
            url: queryURL2,
            method: "GET"
        }).then(function (response) {
            console.log(response);

            const pUV = $("<p>").text("UV Index: " + response.current.uvi)
            fiveDay = response.daily;


            $("#dashboard").append(pUV);

        })
    }


    });

    // figure out how to add icons to forecast
    // save recent cities to local storage and call them when page reloads



})