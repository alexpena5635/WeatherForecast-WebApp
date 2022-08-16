import { MyWeatherAPI } from "./myweatherapi.js";

// List of possible locations user can select
let areas = [];

// Search bar
let input = document.getElementById("searchInput");

// Callback function for user typing in search bar
let timeout = null;
input.addEventListener("input", () => {
    clearTimeout(timeout);
    timeout = setTimeout(() => getResults(areas), 500);
});

// Callback function for user attempting to navigate the dropdown in searchbar
input.addEventListener("keydown", (event) => keyhandler(event));

// Get possible locations based on search results
async function getResults(areas) {
    let input = document.getElementById("searchInput");
    let filter = input.value;

    areas = [];
    let locationResponse = "";

    try {
        locationResponse = await new MyWeatherAPI().getLocation(filter);
    }
    catch (e) {
        console.error(e);
        return;
    }
    
    // Parse the response
    areas = parseLocations(locationResponse);

    // Update the list of areas shown in the DOM
    updateResults(areas);
    
    // Add forecast listneners onclick for each <li> element
    let container = document.getElementById("searchResults");
    let results = container.getElementsByTagName("li");
    for(let i=0; i < results.length; i++) {
        results[i].addEventListener("click", (event) => getForecast(event.target));
    }
}

// Parse through the locationResponse, and return another dictionary-like object
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

// Update the DOM with the list of areas as <li> elements
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

// Get the forecast for selected location (contained in <li>)
async function getForecast(li) {
    // Set the input search value to mirror the selected input
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
    // Parse the relevant information from the forecast response
    let forecasts = parseForecast(forecastResponse);

    // console.log(forecasts);

    // Update the forecast on the DOM
    updateForecast(forecasts, input.value);
}

// Parse the relevant information from the forecast response
function parseForecast(forecastResponse){
    // console.log(JSON.parse(jsonList));

    let dailyForecasts = [];
    
    let dailyForecastsJson = JSON.parse(forecastResponse)['forecast'];
    // console.log(dailyForecastsJson);

    // Iterate through the object, and grab relevant information
    for(let i = 0; i < dailyForecastsJson.length; i++) {
        let date = dailyForecastsJson[i]["date"];
        let temp = dailyForecastsJson[i]["maxTemp"];
        let weatherState = dailyForecastsJson[i]["symbolPhrase"];
        let weatherSymbol = dailyForecastsJson[i]["symbol"];
        let windSpeed = dailyForecastsJson[i]["maxWindSpeed"];
        let windDir = dailyForecastsJson[i]["windDir"];

        // Convert the date into more portable format (weekday and date)
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

// Update the DOM table with the forecast information
function updateForecast(forecasts, location) {
    let table = document.getElementById("weatherTable");
    let results = "";

    table.innerHTML = results;

    // Create the table rows
    for(const day of forecasts) {
        results 
            += "<tr>" 
                + "<td>" + day['day'] + "</td>" 
                + "<td>" + day['date'] + "</td>" 
                + "<td>" + day['temp'] + "&degC" + "</td>" 
                + "<td>" + day['weatherState'] + "</td>" 
                + "<td>" 
                    + "<img src=\"https://developer.foreca.com/static/images/symbols/"  // Weather symbol api from FORECA
                        + day['weatherSymbol'] + ".png\""
                        + "alt=\"" + day['weatherSymbol'] 
                        + "-" + day['weatherState'] + "\"/>"
                + "</td>" 
                + "<td>" + day['windSpeed'] + " m/s" + "</td>" 
                + "<td>" + windDegToCardinal(day['windDir']) + "</td>" 
            + "</tr>";
    }

    table.innerHTML = results;
    updateHeader(location);
    // console.log(results);
}

// Convert the degrees of wind direction to cardinal direction
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

// Update the main header with the current location
function updateHeader(value) {
    let header = document.getElementById("forecastHeader");
    header.innerText = "7 Day Forecast: " + value;
}

// Handle keyup, keydown, and enter in the input box
let activeIndex = 0;
function keyhandler(event) {
    // 13 (enter), 38 (arrow up), 40(arrow down)
    if(![13,38,40].includes(event.keyCode)) {
        return;
    }

    console.log(event);
    let container = document.getElementById("searchResults");
    let results = container.getElementsByTagName("li");

    // Create dictionary of key==index and value==elementID
    let dict = {};
    for(let i=0; i < results.length; i++) {
        dict[i] = results[i].id;
    }

    // console.log(dict);
    // Set selected dropdown as first element if activeIndex is 0
    if(activeIndex == 0) {
        console.log("in here");
        document.getElementById(dict[activeIndex]).classList.add("active");
        document.getElementById(dict[activeIndex]).scrollIntoView();
    }

    // Navigate selected dropdown element up and/or down depending on keypress
    switch(event.keyCode) {
        case 38:
            if(activeIndex > 0) {
                document.getElementById(dict[activeIndex]).classList.remove("active");
                activeIndex -= 1;
                document.getElementById(dict[activeIndex]).classList.add("active");
                document.getElementById(dict[activeIndex]).scrollIntoView();
            }
            return;
        case 40:
            if(activeIndex < results.length-1) {
                document.getElementById(dict[activeIndex]).classList.remove("active");
                activeIndex += 1;
                document.getElementById(dict[activeIndex]).classList.add("active");
                document.getElementById(dict[activeIndex]).scrollIntoView();
            }
            return;
        // 'Select' the current active index element
        case 13:
            document.getElementById("searchInput").blur();
            getForecast(document.getElementById(dict[activeIndex]));
            return;
    }
}