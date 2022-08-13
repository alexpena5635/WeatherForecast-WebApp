const http  = require("http"),
    url     = require("url"),
    path    = require("path"),
    fs      = require("fs")
; 

const hostname = "localhost";
const port = 8080;

// Directory to serve frontend files from
const basedir = __dirname + "/../frontend/" 

// With reference to: https://stackoverflow.com/a/26354478 

const server = http.createServer((req, res) => {
    // Identify the filename from the url (escaping with 'normalize')
    let uri = url.parse(req.url).pathname;
    let filepath = path.join(basedir, path.normalize(uri));

    // Dict of file extensions corresponding to MIME types
    let mimeExtension = {
        '.html': "text/html",
        '.css' : "text/css",
        '.js' : "text/javascript",  // More filetypes ?
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
        res.writeHead(200, headerMime);
        res.write(data, "binary");
        res.end();
    });
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});