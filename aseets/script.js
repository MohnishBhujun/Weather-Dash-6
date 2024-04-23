var apiKey = "40bbe30af4fdc7a4e15f86ddaa57ef11";
var searchVal = "";
var todayWeather = $('#today');
var fiveDaysForecast = $('#forecast');
var searchList = [];
weatherDetails = $('weather-content');

//Display results
$("#search-city-button").on('click', function (event) {

    
    event.preventDefault();

    
    searchVal = $("#search-city").val();
    getWeatherData();

    
    addToHistory();

});

//Generating weather
function getWeatherData() {

    //Clearing previous searches on screen otherwise it repeats
    todayWeather.empty();
    $('#forecast-title').empty();
    fiveDaysForecast.empty();

    //Getting search value & set URL for geocoding API
    var geoQueryURL = "https://api.openweathermap.org/geo/1.0/direct?q=" + searchVal + "&limit=5&appid=" + apiKey;

    //Getting Latitude & Longitude for City
    $.ajax({
        url: geoQueryURL,
        method: "GET"
    }).then(function (response) {

        console.log("Geocoding API Response:", response);

        //Getting lon/lat, reduce to 2 decimals
        var lon = response[0].lon.toFixed(2);
        var lat = response[0].lat.toFixed(2);
        
        var singleDayDataUrl = "https://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon + "&appid=" + apiKey;
        var weatherQueryURL = "https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&appid=" + apiKey;

        //Getting Weather for Current Day
        $.ajax({
            url: singleDayDataUrl,
            method: "GET"
        }).then(function (weatherData) {
            console.log("Single Day API Response:", weatherData);

            //Displaying Current Weather
            displayCurrentWeather(weatherData);
        });

        //Getting Five Day Weather Forecast
        $.ajax({
            url: weatherQueryURL,
            method: "GET"
        }).then(function (forecastData) {
            console.log("Five Day Forecast API Response:", forecastData);

            //Displaying Five Day Weather Forecast
            displayFiveDayForecast(forecastData);
        });

    });
}

//Displaying Current Weather
function displayCurrentWeather(weatherData) {
    var cityName = weatherData.name;
    var currentTemp = weatherData.main.temp;
    var currentHumidity = weatherData.main.humidity;
    var currentWindSpeed = weatherData.wind.speed;

    //Displaying Data in HTML
    $('#current-city').text(cityName);
    $('#current-temperature').text(currentTemp);
    $('#current-humidity').text(currentHumidity);
    $('#current-wind-speed').text(currentWindSpeed);

    //Displaying Current Date using dayjs library
    var currentDate = dayjs().format('dddd, MMMM D, YYYY');
    $('#current-date').text(currentDate);

    //Displaying Weather Content
    todayWeather.removeClass('hide');
}

//Displaying Five Day Weather Forecast
function displayFiveDayForecast(forecastData) {
    for (var i = 0; i < forecastData.list.length; i++) {
        if (forecastData.list[i].dt_txt.includes('12:00:00')) {
            var forecastCard = $('<div>').addClass('col-md-2 forecast-card bg-primary text-white rounded border p-2 mx-1 mb-2');

            var forecastDate = dayjs(forecastData.list[i].dt_txt).format('MM/DD/YYYY');
            var forecastTemp = forecastData.list[i].main.temp;
            var forecastHumidity = forecastData.list[i].main.humidity;

            var forecastDateEl = $('<h6>').addClass('card-title').text(forecastDate);
            var forecastTempEl = $('<p>').addClass('card-text').text('Temp: ' + forecastTemp + '°F');
            var forecastHumidityEl = $('<p>').addClass('card-text').text('Humidity: ' + forecastHumidity + '%');

            forecastCard.append(forecastDateEl, forecastTempEl, forecastHumidityEl);
            fiveDaysForecast.append(forecastCard);
        }
    }

    //Displaying Forecast Title
    $('#forecast-title').text('5-Day Forecast');
}

//Adding search history
function addToHistory() {
    var searchItem = $('<li>').addClass('list-group-item').text(searchVal);

   
    searchList.push(searchVal);

    
    $('#search-history-list').append(searchItem);

    
    $('#clear-history').removeClass('hide');
}