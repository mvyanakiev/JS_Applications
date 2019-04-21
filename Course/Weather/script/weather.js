const API_KEY = "dXYels1ucCsV7rpmfN1EehHxUbggVkVs";
const LOCATION = "51097"; // Sofia
const LANGUAGE = "bg-bg";
const BASE_URL = "http://dataservice.accuweather.com";
const SUFFIX_FORECAST = "/forecasts/v1/hourly/12hour/";
const SUFFIX_USUAL = "/currentconditions/v1/";
let measuredWeather = [];
let weatherForecast = [];

function composerForecast() {
    return BASE_URL + SUFFIX_FORECAST + LOCATION + "?apikey=" + API_KEY + "&details=true&metric=true";
}

function composerPastWeather() {
    return BASE_URL + SUFFIX_USUAL + LOCATION + "/historical/24?apikey=" + API_KEY + "&details=true";
}

function composerCurrent() {
    return BASE_URL + SUFFIX_USUAL + LOCATION + "?apikey=" + API_KEY + "&language=" + LANGUAGE + "&details=true";
}


// http://dataservice.accuweather.com/currentconditions/v1/51097?apikey=dXYels1ucCsV7rpmfN1EehHxUbggVkVs


function getForecast() {
    $.ajax({
        method: "GET",
        url: composerForecast(),
        success: successGetForecast,
        error: errorHandler,
    })
}

function getCurrentWeather() {
    $.ajax({
        method: "GET",
        url: composerCurrent(),
        success: successGetWeather,
        error: errorHandler,
    })
}

function getPastWeather() {
    $.ajax({
        method: "GET",
        url: composerPastWeather(),
        success: successGetPastWeather,
        error: errorHandler,
    })
}

function successGetForecast(forecast) {

    weatherForecast = forecast;
    return weatherForecast;
}

function successGetPastWeather(pastWeather) {

    measuredWeather = pastWeather;
    return pastWeather

}

function successGetWeather(data) {

    let weatherText = data[0].WeatherText;
    let currentTemperature = data[0].Temperature.Metric.Value;
    let currentRealFeel = data[0].RealFeelTemperature.Metric.Value;
    let airPresureTendency = data[0].PressureTendency.LocalizedText;


    // let detailsOfMeasure = new Date(data[0].EpochTime);
    // let hui1 = Date(data[0].EpochTime);
    // let dateOfMeasure = (detailsOfMeasure.toLocaleDateString('bg-BG'));
    // let timeOfMeasure = (detailsOfMeasure.toLocaleTimeString('bg-BG'));

    // console.log("Current");
    // console.log(data);


    let tetxToAppend = formatDate(Date(data[0].EpochTime));

    tetxToAppend += `<p>Времето в момента е: <strong>${weatherText}</strong></p>`;
    tetxToAppend += `<p>Температурата в момента е: ${currentTemperature} °C</p>`;
    tetxToAppend += `<p>Усеща се като: ${currentRealFeel} °C</p>`;
    tetxToAppend += `<p>Атмосферно налягане: ${airPresureTendency}</p>`;

    $(main).append(tetxToAppend);


}

function formatDate(dateISO8601) {
    let date = new Date(dateISO8601);

    if (Number.isNaN(date.getDate()))
        return '';

    return date.getDate() + '.' + padZeros(date.getMonth() + 1) +
        "." + date.getFullYear() + ' ' + date.getHours() + ':' +
        padZeros(date.getMinutes()) + ':' + padZeros(date.getSeconds());


    function padZeros(num) {
        return ('0' + num).slice(-2);
    }
}

function errorHandler(msg) {
    console.log(msg);
}

//нулевия елемент от прогнозата отговаря на последния от миналия ден или като го ревърснеш си става 1:1
//зареждаш първия масив, success -> then втория, then калкулациите -> всичко става последователно
// promise.all()


// function runApp() {
//
//     getPastWeather();
//     getForecast();
//
//     // Promise.all(getForecast(), getPastWeather()).then(successGetForecast, successGetPastWeather).catch(errorHandler);

// }








// for (let hour of weatherForecast) {
//
//     let futureTemp = weatherForecast.Temperature.Value;
//     let futureHour = weatherForecast.DateTime;
//
//
//     console.log(futureTemp, futureHour);
//
//
// }


