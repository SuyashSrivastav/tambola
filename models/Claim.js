const mongoose = require("mongoose");

const Schema = mongoose.Schema;

var claimSchema = new Schema({

    player_id: Schema.Types.ObjectId,
    game_id: Schema.Types.ObjectId,
    ticket_id: Schema.Types.ObjectId,

    claim_type: {
        type: String,
        enum: ['four-corners', 'top-line', 'middle-line', 'bottom-line', 'full-house']
    },
    claim_time: Date

});

module.exports = mongoose.model("Claim", claimSchema);