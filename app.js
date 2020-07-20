var express = require("express");

var bodyParser = require("body-parser");

var app = express();

var router = require("./router")

var mongo = require("./mongo")
var a = require("./a")

// Add ability to read json data from body
app.use(
    bodyParser.json({
        limit: "50mb"
    })
);

app.use("/api", router);


module.exports = app;