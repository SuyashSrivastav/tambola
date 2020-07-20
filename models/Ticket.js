const mongoose = require("mongoose");

const Schema = mongoose.Schema;

var ticketSchema = new Schema({

    player_id: Schema.Types.ObjectId,
    game_id: Schema.Types.ObjectId,
    ticket: {
        type: [Array],
        default: [
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
        ]
    },
    ticket_numbers: [Array],
    cut_off_numbers: [Number],
    status: String,
    created_at: Date,
    updated_at: Date
});

module.exports = mongoose.model("Ticket", ticketSchema);