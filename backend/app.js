const http      = require("http"),
    url         = require("url"),
    path        = require("path"),
    fs          = require("fs"),
    WeatherAPI  = require("./weatherapi.js")
;

const hostname = "localhost";
const port = 8080;

// Directory to serve frontend files from
const basedir = __dirname + "/../frontend/";

const server = http.createServer((req, res) => {
    
    res.setHeader("Access-Control-Allow-Origin", "localhost:8080"); // Security issue
    res.setHeader("Access-Control-Allow-Methods", "OPTIONS, POST, GET");
    res.setHeader("Access-Control-Max-Age", 2592000); // 30 days

    if (req.method === "OPTIONS") {
        res.writeHead(204);
        res.end();
        return;
    }
    // Split code off into api and web server
    // API
    if(req.url.startsWith("/api")) {
        api(req, res);
    }
    // Serve Files
    else {
        webserver(req, res);
    }
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});

// Basic webserver to serve html, css, and js files to host the website
// Webserver built with reference to: https://stackoverflow.com/a/26354478 
function webserver(req, res) {
    // Identify the filename from the url (escaping with 'normalize')
    let uri = url.parse(req.url).pathname;
    let filepath = path.join(basedir, path.normalize(uri));

    // Dict of file extensions corresponding to mime types
    let mimeExtension = {
        '.html' : "text/html",
        '.css'  : "text/css",
        '.js'   : "text/javascript",
        '.mjs'  : "text/javascript" // More filetypes ?
    };

    // Add index.html to path if it is a directory
    try{
        let stats = fs.statSync(filepath)
        if(stats.isDirectory()) filepath += "index.html"
    }
    catch(err) {
        // Only ignore file not found error
        if(err.code != "ENOENT") {
            res.writeHead(500, {"Content-Type": "text/plain"});
            res.write(err + "\n");
            res.end();
            return;
        }
    }

    console.log(filepath);

    // Read the filepath
    fs.readFile(filepath, "binary", (err, data) => {
        if(err) {
            switch(err.code) {
                // Error : 404
                case "ENOENT":
                    res.writeHead(404, {"Content-Type": "text/html"});
                    res.write("<h1>404: Not Found</h1>");
                    break;
                // Eroror: All others
                default:
                    res.writeHead(500, {"Content-Type": "text/plain"});
                    res.write(err + "\n");
                    break;
            }
            res.end();
            return;
        }

        // Construct the HTTP response, and send the file
        let headerMime = mimeExtension[path.extname(filepath)] || "text/plain";
        console.log(headerMime);
        res.writeHead(200, {
            "Content-Type": headerMime
        });
        res.write(data, "binary");
        res.end();
    });
}

// API functionality for the frontend to query
async function api(req, res) {
    // "/api/" contains 5 chars, the offset is 5
    let apiOffset = 5; 
    let endpoint = req.url.substring(apiOffset);

    let locationRegex = "^(location|(location\/[a-zA-Z(%20)]+))(\/)?$";
    let forecastRegex = "^(forecast|(forecast\/[0-9]+))(\/)?$";

    // Default request route
    if (endpoint === "" && req.method === "GET") {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.write("API Test!");
        res.end();
    }
    // "/api/location/<city>"
    else if (endpoint.match(locationRegex) && req.method === "GET") {
        // Split the URL into pieces, and grab the last path
        // Should correspond to the "<city>" part of URL
        let pieces = endpoint.split('/');
        let city = pieces.pop() || pieces.pop();

        console.log("city: " + city);


        let data = "{\"locations\":[]}";
        try {
            data = await new WeatherAPI().getLocation(city);
        }
        catch (e) {
            console.error(e);
        }

        res.writeHead(200, { "Content-Type": "application/json" });
        res.write(data);
        res.end();
    }
    // "/api/forecast/daily/<locationID>"
    else if (endpoint.match(forecastRegex) && req.method === "GET") {
        // Split the URL into pieces, and grab the last path
        // Should correspond to the "<locationID>" part of URL
        let pieces = endpoint.split('/');
        let locationID = pieces.pop() || pieces.pop();
    
        // Query the weather API to get the 7 day forecast data
        let data = "{\"forecast\":[]}";
        try {
            data = await new WeatherAPI().getForecast(locationID);
        }
        catch (e) {
            console.error(e);
        }

        res.writeHead(200, { "Content-Type": "application/json" });
        res.write(data);
        res.end();
    }
    // Non-existent route
    else {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Route not found" }));
    }
}