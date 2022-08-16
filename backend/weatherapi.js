const fs    = require("fs");
var axios   = require("axios").default;

// API Token path
const authFilePath = "<path_to_your_api_token>";

const tokenFile = __dirname + authFilePath;

// Set the default url for axios to the weather api
let token = fs.readFileSync(tokenFile, "utf-8");
axios.defaults.baseURL = "https://fnw-us.foreca.com/api/v1";
axios.defaults.headers.common = {'Authorization': `Bearer ${token}`}

// Class to handle transactions with Foreca weather api using axios
class WeatherAPI {
    // Get location data from the Foreca api
    async getLocation(location) {
        const response = await axios.get("/location/search/" + location, {
            responseType: "json",
            transformResponse: [v => v]
        });

        return response.data;
    }

    // Get forecast data from the Foreca api, selecting the full datqaset
    async getForecast(locationID) {
        const response = await axios.get("/forecast/daily/" + locationID + "?dataset=full", {
            responseType: "json",
            transformResponse: [v => v]
        });

        return response.data;
    }
}

module.exports = WeatherAPI;
