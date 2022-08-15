import { MyWeatherAPI } from "./myweatherapi.js";

let areas = [];


let input = document.getElementById("searchInput");
if(input) {
    input.addEventListener("input", () => getResults(areas));
}
else{
    console.error("input null");
}

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
}

function updateResults(areas) {
    let ul = document.getElementById("searchResults");

    ul.innerHTML = "";
    let list = "";

    for(const area of areas) {
        // console.log(area);
        list += "<li id=\"" + area['id'] + "\"> " + area['city'] + ", " 
            + area['region'] + ", " + area["country"] + "</li>";
    }

    ul.innerHTML = list;
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


