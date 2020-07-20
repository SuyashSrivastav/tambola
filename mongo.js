//Import the mongoose module
var mongoose = require('mongoose');

//Set up default mongoose connection
var url = 'mongodb://127.0.0.1/tambola';

try {
    mongoose.connect(url, { useNewUrlParser: true });
} catch (error) {
    console.log(error);
}
//Get the default connection
var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once("open", function () {
    console.log("connected to db!!!");
});
exports.data = mongoose;