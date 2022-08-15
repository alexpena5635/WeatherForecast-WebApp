import { MyWeatherAPI } from "./myweatherapi.js";

let areas = [];


let input = document.getElementById("searchInput");

input.addEventListener("input", () => getResults(areas));



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
    console.log(li.id);

    let forecast = "";

    try {
        forecast = await new MyWeatherAPI().getForecast(li.id);
    }
    catch (e) {
        console.error(e);
        return;
    }

    
}

