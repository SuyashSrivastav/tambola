const mongoose = require("mongoose");

const Schema = mongoose.Schema;

var playerSchema = new Schema({

    user_name: String,
    points: {
        type: Number,
        default: 0
    },
    email: String,
    is_active: {
        type: Boolean,
        default: true
    },
    created_at: Date

});

module.exports = mongoose.model("Player", playerSchema);