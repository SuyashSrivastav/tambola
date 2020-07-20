var http = require("http")
var app = require("./app")

port = process.env.PORT || 8001

var server = http.createServer(app)

//Create HTTP server.
var server = http.createServer(app);
server.listen(port, () => {
    console.log("HTTP server running on PORT : " + port);
});
