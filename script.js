$(document).ready(function () {

    function currentTime() {
        $('#current-day').html(moment().format('llll'));
    }
    currentTime();
    setInterval(function () {
        currentTime();
    }, 1000);

var citySearch = $(search-city).val()
    searchBtn = $(search-btn)


})