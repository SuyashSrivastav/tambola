var express = require("express");

var router = express.Router();

const playerController = require("./controller/PlayerController")
const gameController = require("./controller/GameController")
const ticketController = require("./controller/TicketController")
const initiateProcess = require("./process/UpdateTicketProcess")

/**User Routes */
router.post('/user/create', playerController.createPlayer);

/**Game Routes */
router.post('/game/create', gameController.createGame);
router.post('/game/number/random', gameController.generateRandomNumber);
router.post('/game/numbers', gameController.allNumbersPicked);
router.post('/game/stats', gameController.getGameStats);



/**Ticket Routes*/
router.post('/game/ticket/generate', ticketController.createMyTicket);







module.exports = router;