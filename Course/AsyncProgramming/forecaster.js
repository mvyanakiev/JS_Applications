function attachEvents() {

    $('#submit').on('click', getWeather);


    function getWeather() {

        $.get({
            url: "https://judgetests.firebaseio.com/locations.json",
            success: getCode,
            error: err
        })
    }

    function getCode(data) {
        $('#current').empty();
        $('#upcoming').empty();

        let nameCity = $('#location').val();
        let cityCode = null;

        for (let obj of data) {
            if (nameCity === obj.name) {
                cityCode = obj.code;

                $.get({
                    url: "https://judgetests.firebaseio.com/forecast/today/" + cityCode + ".json",
                    success: getForecast,
                    error: err,
                });

                $.get({
                    url: "https://judgetests.firebaseio.com/forecast/upcoming/" + cityCode + ".json",
                    success: get3dayForecast,
                    error: err,
                });
            }
        }

        if (cityCode === null)
            err()
    }

    function getForecast(result) {

        let name = result.name;
        let weather = [];

        for (let key in result.forecast) {
            weather.push(result.forecast[key]
            )
        }

        // console.log(forecastSymbol(kur[0]));
        // console.log(kur.join(" -> "));

        let conditionSymbol = forecastSymbol(weather[0]);
        let low = weather[1];
        let high = weather[2];

        let weatherHtml = `
        <span class="condition symbol">${conditionSymbol}</span>
            <span class="condition">
                <span class="forecast-data">${name}</span>
                <span class="forecast-data">${high}&#176;/${low}&#176;</span>
                <span class="forecast-data">${weather[0]}</span>
            </span>
        `;

        $('#forecast').css("display", "inline");
        $('#current').append(weatherHtml);
    }

    function forecastSymbol(param) {
        switch (param) {

            case "Sunny" :
                return "&#x2600;";
                break;

            case "Partly sunny" :
                return "&#x26C5;";
                break;

            case "Overcast" :
                return "&#x2601;";
                break;

            case "Rain" :
                return "&#x2614";
                break;
        }
    }

    function get3dayForecast(result) {
        for (let key in result.forecast) {
            $('#upcoming').append(
                `<span class="upcoming">
            <span class="symbol">${forecastSymbol(result.forecast[key].condition)}</span>
        <span class="forecast-data">${result.forecast[key].low}&#176;/${result.forecast[key].high}&#176;</span>
        <span class="forecast-data">${result.forecast[key].condition}</span>
            </span>`
            );
        }
    }

    function err() {
        $('#current').css("display", "inline").text("Маймун");
    }

}