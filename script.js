$(document).ready(function () {

    function currentTime() {
        $('#current-day').html(moment().format('llll'));
    };
    currentTime();
    setInterval(function () {
        currentTime();
    }, 1000);

    // var citySearch = $(search-city).val()
    //     searchBtn = $(search-btn);

    $("#another-btn").on("click", function (event) {

        event.preventDefault();



        var city = $("#search-city").val()
        APIkey = "9a01a6d9d70a31597772c3b431a80849"
        queryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIkey;

        console.log(city);
        console.log(queryURL);

        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            console.log(response)
            // $("#dashboard").appendchild(response)
        })
    })

    // $("#another-btn").on("click"), function (event) {


    //     event.preventDefault();


    //     console.log("clicked");


    // };

    // $("#find-movie").on("click", function(event) {

    //     // event.preventDefault() can be used to prevent an event's default behavior.
    //     // Here, it prevents the submit button from trying to submit a form when clicked
    //     event.preventDefault();

    //     // Here we grab the text from the input box
    //     var movie = $("#movie-input").val();

    //     // Here we construct our URL
    //     var queryURL = "https://www.omdbapi.com/?t=" + movie + "&apikey=trilogy";

    //     // Write code between the dashes below to hit the queryURL with $ajax, then take the response data
    //     // and display it in the div with an id of movie-view

    //     // ------YOUR CODE GOES IN THESE DASHES. DO NOT MANUALLY EDIT THE HTML ABOVE.

    //     $.ajax({
    //       url: queryURL,
    //       method: "GET"
    //     }).then(function(response) {
    //       $("#movie-view").text(JSON.stringify(response));
    //     });

    //     // -----------------------------------------------------------------------

    //   });

})