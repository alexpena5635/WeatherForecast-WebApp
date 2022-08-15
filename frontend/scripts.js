import { MyWeatherAPI } from "./myweatherapi.js";

let areas = [];


let input = document.getElementById("searchInput");
let timeout = null;

input.addEventListener("input", () => {
    clearTimeout(timeout);
    timeout = setTimeout(() => getResults(areas), 500);
});


async function getResults(areas) {
    let input = document.getElementById("searchInput");
    let filter = input.value;

    areas = []

    let locationResponse = "";

    try {
        locationResponse = await new MyWeatherAPI().getLocation(filter);
    }
    catch (e) {
        console.error(e);
        return;
    }
    
    areas = parseLocations(locationResponse);

    updateResults(areas);
    
    let container = document.getElementById("searchResults");
    let results = container.getElementsByTagName("li");

    for(let i=0; i < results.length; i++) {
        results[i].addEventListener("click", (event) => getForecast(event.target));
    }
}

function parseLocations(locationResponse){
    // console.log(JSON.parse(jsonList));

    let areas = [];
    
    let areasJson = JSON.parse(locationResponse)['locations'];
    // console.log(areasJson);

    for(let i = 0; i < areasJson.length; i++) {
        // console.log(areasJson[i]);
        let id = areasJson[i]["id"];
        let city = areasJson[i]["name"];
        let region = areasJson[i]["adminArea"];
        let country = areasJson[i]["country"];
        
        areas.push({
            'id': id,
            'city': city,
            'region': region,
            'country': country
        });
    }
    
    return areas;
}   

function updateResults(areas) {
    let ul = document.getElementById("searchResults");

    ul.innerHTML = "";
    let list = "";

    for(const area of areas) {
        // console.log(area);
        list 
            += "<li id=\"" + area['id'] + "\"> " + area['city'] + ", " + area['region'] 
            + ", " + area["country"] + "</li>";
    }

    ul.innerHTML = list;
}

async function getForecast(li) {
    let input = document.getElementById("searchInput");
    input.value = li.innerText;
    // console.log(li.id);

    let forecastResponse = "";

    try {
        forecastResponse = await new MyWeatherAPI().getForecast(li.id);
    }
    catch (e) {
        console.error(e);
        return;
    }


    // console.log(forecastResponse);

    let forecasts = parseForecast(forecastResponse);

    // console.log(forecasts);

    updateForecast(forecasts, input.value);
}

function parseForecast(forecastResponse){
    // console.log(JSON.parse(jsonList));

    let dailyForecasts = [];
    
    let dailyForecastsJson = JSON.parse(forecastResponse)['forecast'];
    // console.log(dailyForecastsJson);

    for(let i = 0; i < dailyForecastsJson.length; i++) {
        let date = dailyForecastsJson[i]["date"];
        let temp = dailyForecastsJson[i]["maxTemp"];
        let weatherState = dailyForecastsJson[i]["symbolPhrase"];
        let weatherSymbol = dailyForecastsJson[i]["symbol"];
        let windSpeed = dailyForecastsJson[i]["maxWindSpeed"];
        let windDir = dailyForecastsJson[i]["windDir"];

        let dateObject = new Date(date);

        let day = dateObject.toLocaleDateString("en-US", 
            { 
                weekday: 'long',
                timeZone: 'UTC'
            }
        );

        let month = dateObject.getUTCMonth()+1;
        let dateString = "" + month + "/" +  dateObject.getUTCDate();
        
        dailyForecasts.push({
            'day': day, 
            'date': dateString,
            'temp': temp,
            'weatherState': weatherState,
            'weatherSymbol': weatherSymbol,
            'windSpeed': windSpeed,
            'windDir': windDir
        });
    }
    
    return dailyForecasts;
} 

function updateForecast(forecasts, location) {
    let table = document.getElementById("weatherTable");
    let results = "";

    table.innerHTML = results;

    for(const day of forecasts) {
        results 
            += "<tr>" 
                + "<td>" + day['day'] + "</td>" 
                + "<td>" + day['date'] + "</td>" 
                + "<td>" + day['temp'] + "&degC" + "</td>" 
                + "<td>" + day['weatherState'] + "</td>" 
                + "<td>" 
                    + "<img src=\"https://developer.foreca.com/static/images/symbols/" 
                        + day['weatherSymbol'] + ".png\"/>"
                + "</td>" 
                + "<td>" + day['windSpeed'] + " m/s" + "</td>" 
                + "<td>" + windDegToCardinal(day['windDir']) + "</td>" 
            + "</tr>";
    }

    table.innerHTML = results;
    updateHeader(location);
    // console.log(results);
}

function windDegToCardinal(degrees) {
    // Referenced by: https://stackoverflow.com/a/7490772
    // Divide by 22.5 because 350deg/16 directions == 22.5deg/direction
    let value = parseInt(degrees / 22.5 + .5);

    let dirs = [
        "N","NNE","NE", "NW","NNW",
        "ENE","E","ESE", 
        "SE", "SSE","S","SSW","SW",
        "WSW","W","WNW",
    ]

    return dirs[(value % 16)]
}

function updateHeader(value) {
    let header = document.getElementById("forecastHeader");
    header.innerText = "7 Day Forecast: " + value;
}