const API_KEY = "dXYels1ucCsV7rpmfN1EehHxUbggVkVs";
const LOCATION = "51097"; // Sofia
const LANGUAGE = "bg-bg";
const BASE_URL = "http://dataservice.accuweather.com/currentconditions/v1/";
const DETAILS = true;




function composer(location, language, details) {
    return BASE_URL + LOCATION + "?apikey=" + API_KEY + "&language=" + LANGUAGE + "&details=" + DETAILS;
}


function getCurrentWeather() {


    $.ajax({
        method: "GET",
        url: composer(),
        success: successGetWeather,
        error: errorHandler,
    })


}

function successGetWeather(data) {

    let weatherText = data[0].WeatherText;
    let currentTemperature = data[0].Temperature.Metric.Value;
    let currentRealFeel = data[0].RealFeelTemperature.Metric.Value;
    let airPresureTendency = data[0].PressureTendency.LocalizedText;

    // let detailsOfMeasure = new Date(data[0].EpochTime);

    let hui1 = Date(data[0].EpochTime);
    console.log(hui1);


    // let dateOfMeasure = (detailsOfMeasure.toLocaleDateString('bg-BG'));
    // let timeOfMeasure = (detailsOfMeasure.toLocaleTimeString('bg-BG'));


    console.log(data);




    console.log("Времето в момента е: "+weatherText);
    console.log("Температурата в момента е: "+currentTemperature);
    console.log("Усеща се като: "+currentRealFeel);
    console.log("Атмосферно налягане: "+airPresureTendency);






}


function errorHandler(msg) {
    alert("Ui");
}