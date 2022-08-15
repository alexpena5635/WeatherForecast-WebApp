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

    let forecasts = parseForecast(forecastResponse);

    // console.log(forecasts);

    updateForecast(forecasts);
}

function parseForecast(forecastResponse){
    // console.log(JSON.parse(jsonList));

    let dailyForecasts = [];
    
    let dailyForecastsJson = JSON.parse(forecastResponse)['forecast'];
    // console.log(dailyForecastsJson);

    for(let i = 0; i < dailyForecastsJson.length; i++) {
        // console.log(dailyForecastsJson[i]);
        // let day = dailyForecastsJson[i]["day"];
        let date = dailyForecastsJson[i]["date"];
        let temp = dailyForecastsJson[i]["maxTemp"];
        let weatherState = dailyForecastsJson[i]["symbolPhrase"];
        let weatherSymbol = dailyForecastsJson[i]["symbol"];
        let windSpeed = dailyForecastsJson[i]["maxWindSpeed"];
        let windDir = dailyForecastsJson[i]["windDir"];
        
        dailyForecasts.push({
            // 'day': day, 
            'date': date,
            'temp': temp,
            'weatherState': weatherState,
            'weatherSymbol': weatherSymbol,
            'windSpeed': windSpeed,
            'windDir': windDir
        });
    }
    
    return dailyForecasts;
} 

function updateForecast(forecasts) {
    let table = document.getElementById("weatherTable");

    let results = "<tr>" 
                + "<td>" + "Day" + "</td>" 
                + "<td>" + "Date" + "</td>" 
                + "<td>" + "Temperature" + "</td>" 
                + "<td>" + "WeatherState" + "</td>" 
                + "<td>" + "WeatherSymbol" + "</td>" 
                + "<td>" + "WindSpeed" + "</td>" 
                + "<td>" + "WindDir" + "</td>" 
            + "</tr>";

   
    table.innerHTML = results;

    for(const day of forecasts) {
        results 
            += "<tr>" 
                + "<td>" + "Day" + "</td>" 
                + "<td>" + day['date'] + "</td>" 
                + "<td>" + day['temp'] + "</td>" 
                + "<td>" + day['weatherState'] + "</td>" 
                + "<td>" + day['weatherSymbol'] + "</td>" 
                + "<td>" + day['windSpeed'] + "</td>" 
                + "<td>" + day['windDir'] + "</td>" 
            + "</tr>";
    }

    table.innerHTML = results;
    console.log(results);
}