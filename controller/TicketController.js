const ObjectId = require('mongoose').Types.ObjectId;
var tambola = require('tambola-generator');
const baseController = require("./BaseController");
const ticketService = require("../services/TicketService");
const gameService = require("../services/GameService")
const PlayerService = require('../services/PlayerService');

const createMyTicket = async (req, res, next) => {

    let errMsg = "error";
    let errCode = 404;

    let game_id = req.body.game_id ? req.body.game_id : null
    let user_name = req.body.user_name ? req.body.user_name : ""

    let playerData = await PlayerService.get({ user_name: user_name }).catch(e => next(e))
    if (game_id == null || user_name == "" || playerData && playerData.length > 0) {
        errMsg = "username-invalid";
        res.send(baseController.generateResponse(errCode, errMsg));
    }
    else {
        let playercreated = await PlayerService.create({ user_name: user_name }).catch(e => next(e))
        //console.log(playercreated)
        let gameData = await gameService.update({ _id: game_id }, { $addToSet: { players_joined: playercreated._id } }).catch(e => next(e))
        //console.log(gameData)

        if (playercreated && JSON.stringify(playercreated) !== '{}' && gameData && gameData.nModified > 0) {


            const tickets = tambola.getTickets(1)

            let ticketcreated = await ticketService.create({
                ticket: tickets[0],
                player_id: playercreated._id,
                game_id: game_id
            }).catch(e => next(e))

            let ticket_numbers = tickets[0]

            for (var j = 0; j < 3; j++) {
                while (ticket_numbers[j].includes(0)) {
                    ticket_numbers[j].splice(ticket_numbers[j].indexOf(0), 1)
                }
            }

            let updateTicket = await ticketService.update({ _id: ticketcreated._id }, { $set: { ticket_numbers: ticket_numbers } }).catch(e => next(e))



            if (ticketcreated && JSON.stringify(ticketcreated) !== "{}" && updateTicket && JSON.stringify(updateTicket) != '{}') {
                errMsg = "success";
                errCode = 0;
                res.send(baseController.generateResponse(errCode, errMsg, { ticket_id: ticketcreated._id }));
            }
            else {
                res.send(baseController.generateResponse(errCode, errMsg));
            }

        }
        else {
            errMsg = "data-not-found";
            res.send(baseController.generateResponse(errCode, errMsg));
        }
    }

}


module.exports = {
    createMyTicket
}