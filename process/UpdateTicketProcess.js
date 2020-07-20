const ObjectId = require('mongoose').Types.ObjectId;
const mongoose = require("mongoose");
const GameService = require('../services/GameService');
const TicketService = require('../services/TicketService');


var connected = false;
var doingJob = false;
var url = 'mongodb://127.0.0.1/tambola';



async function connectDB() {

    if (!connected) {
        try {
            mongoose.connect(url, {
                useNewUrlParser: true,
                useUnifiedTopology: true
            });
        } catch (error) {
            console.log(error);
        }
        var db = mongoose.connection;
        db.on("error", console.error.bind(console, "connection error:"));
        db.once("open", function () {
            connected = true;
            console.log("UpdateProcessConnected!");
        });
    }
}

setInterval(() => {
    if (!doingJob) {
        connectDB();
        // console.log("Initiate update ticket at ", new Date());
        updateTicketProcess();
    }
}, 60 * 200);


async function updateTicketProcess() {

    let errMsg = "no-game";
    doingJob = true;


    let gameData = await GameService.search({ start_date: { $lt: new Date() }, status: "Live" })

    if (gameData && gameData.length > 0) {

        for (var i in gameData) {

            let numbers_drawn_array = gameData[i].numbers_drawn
            let last_drawn_object = numbers_drawn_array[numbers_drawn_array.length - 1] ? (numbers_drawn_array[numbers_drawn_array.length - 1]) : {}
            let cutoff_done = last_drawn_object.cutoff_done ? last_drawn_object.cutoff_done : false;

            if (!cutoff_done && last_drawn_object.number) {

                let last_drawn = last_drawn_object.number

                let ticketIdArray = []
                let tickets = await TicketService.search({ game_id: gameData[i]._id })

                if (tickets && tickets.length > 0) {
                    let exist = false
                    for (var j in tickets) {
                        let top_line = tickets[j].ticket_numbers[0]
                        let middle_line = tickets[j].ticket_numbers[1]
                        let bottom_line = tickets[j].ticket_numbers[2]

                        if (top_line.includes(last_drawn) || middle_line.includes(last_drawn) || bottom_line.includes(last_drawn)) {
                            ticketIdArray.push(tickets[j]._id)
                            exist = true
                        }
                        // else {
                        //     console.log("NO CUTOFF FOUND")
                        // }
                    }
                    if (exist) {
                        let updateTicket = await TicketService.updateMany({ _id: { $in: ticketIdArray } }, { $addToSet: { cut_off_numbers: last_drawn } })
                        // if (updateTicket && updateTicket.length == ticketIdArray.length) {
                        //     console.log("ALL TICKETS CUTOFF")
                        // }
                    }
                }
                else {
                    break
                }
                await GameService.update({ _id: gameData[i]._id, 'numbers_drawn.number': last_drawn }, { $set: { 'numbers_drawn.$.cutoff_done': true } })
                console.log("TICKETS HAVE BEEN CUTOFF at:", new Date())

            } else {
                continue
            }
        }
    }
    else {
        doingJob = false;
        errMsg = "game-not-availible"
        console.log(errMsg);
        return errMsg;
    }
    doingJob = false;
    // console.log("msg ", errMsg);
    errMsg = "success";
    return errMsg;
}   