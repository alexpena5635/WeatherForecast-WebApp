// Set the default url for axios to my backend api
axios.defaults.baseURL = "http://localhost:8080/api/";

// Class to handle transactions with my backend weather api using axios
export class MyWeatherAPI {
    // Get location data from my api
    async getLocation(city) {
        const response = await axios.get("/location/" + city, {
            responseType: "json",
            transformResponse: [v => v]
        });

        return response.data;
    }

    // Get forecast data from the my api
    async getForecast(locationID) {
        const response = await axios.get("/forecast/" + locationID, {
            responseType: "json",
            transformResponse: [v => v]
        });

        return response.data;
    }
}