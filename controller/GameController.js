const ObjectId = require('mongoose').Types.ObjectId;
const baseController = require("./BaseController");
var tambola = require('tambola-generator');
const gameService = require("../services/GameService")
const playerService = require("../services/PlayerService");
const TicketService = require('../services/TicketService');


const createGame = async (req, res, next) => {

    let errMsg = "error";
    let errCode = 404;

    let name = req.body.name ? req.body.name : "Game : " + (new Date()).toString().substring(0, 21)
    let start_date = req.body.start_date ? req.body.start_date : new Date()

    let playerIdArray = await playerService.getPlayerIdArray({ is_active: true }).catch(e => next(e))
    //console.log(playerIdArray)
    if (name != "" && playerIdArray && playerIdArray[0].player_id_array.length > 0) {
        let sequence = tambola.getDrawSequence()
        let gamecreated = await gameService.create({
            name: name,
            start_date: start_date,
            players_joined: [],
            draw_sequence: sequence,
            created_at: new Date()
        }).catch(e => next(e))

        if (gamecreated && JSON.stringify(gamecreated) !== "{}") {
            errMsg = "success";
            errCode = 0;
            res.send(baseController.generateResponse(errCode, errMsg, { game_id: gamecreated._id }));
        }
    }
    else {
        res.send(baseController.generateResponse(errCode, errMsg));
    }
}


const generateRandomNumber = async (req, res, next) => {

    let errMsg = "error";
    let errCode = 404;

    let game_id = req.body.game_id ? req.body.game_id : null
    let gameData = await gameService.get({ _id: game_id }).catch(e => next(e))
    if (gameData && gameData) {

        if (gameData[0].numbers_drawn.length != gameData[0].draw_sequence.length) {

            let randomNumber = gameData[0].draw_sequence[gameData[0].numbers_drawn.length ? gameData[0].numbers_drawn.length : 0]
            //console.log(randomNumber)'

            let updateGame = await gameService.update({ _id: game_id }, {
                $push: {
                    numbers_drawn: {
                        number: randomNumber,
                        time: new Date()
                    }
                }
            }).catch(e => next(e))

            if (updateGame && updateGame.nModified == 1) {

                if (gameData[0].numbers_drawn.length == 0) {
                    await gameService.update({ _id: game_id }, { $set: { status: 'Live' } }).catch(e => next(e))
                }


                errMsg = "success";
                errCode = 0;
                res.send(baseController.generateResponse(errCode, errMsg, { random_number: randomNumber }));
            }
            else {
                res.send(baseController.generateResponse(errCode, errMsg));
            }
        }
        else {
            let updateGame = await gameService.update({ _id: game_id }, { $set: {} })
            errMsg = "numbers-finished";
            res.send(baseController.generateResponse(errCode, errMsg));
        }
    }
    else {
        errMsg = "game-not-found";
        res.send(baseController.generateResponse(errCode, errMsg));
    }
}


const allNumbersPicked = async (req, res, next) => {


    let errMsg = "error";
    let errCode = 404;

    let game_id = req.body.game_id ? req.body.game_id : null
    let gameData = await gameService.getNumberArray({ _id: ObjectId(game_id) }).catch(e => next(e))
    //console.log(gameData)
    if (gameData && gameData.length > 0 && gameData[0].numbers && gameData[0].numbers.length > 0) {
        errMsg = "success";
        errCode = 0;
        res.send(baseController.generateResponse(errCode, errMsg, { generated_numbers: gameData[0].numbers }));
    }
    else {
        errMsg = "not-found";
        res.send(baseController.generateResponse(errCode, errMsg));
    }
}


const getGameStats = async (req, res, next) => {


    let errMsg = "error";
    let errCode = 404;

    let game_id = req.body.game_id ? req.body.game_id : null
    let gameData = await gameService.getGameStats({ _id: ObjectId(game_id) }).catch(e => next(e))
    //console.log(gameData)
    if (gameData && gameData.length > 0) {
        errMsg = "success";
        errCode = 0;
        res.send(baseController.generateResponse(errCode, errMsg, { game_stats: gameData[0] }));
    }
    else {
        errMsg = "not-found";
        res.send(baseController.generateResponse(errCode, errMsg));
    }
}


module.exports = {
    createGame,
    generateRandomNumber,
    allNumbersPicked,
    getGameStats
}
