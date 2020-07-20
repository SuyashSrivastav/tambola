const ObjectId = require('mongoose').Types.ObjectId;
const baseController = require("./BaseController");
const playerService = require("../services/PlayerService")

const createPlayer = async (req, res, next) => {

    let errMsg = "error";
    let errCode = 404;

    let name = req.body.name ? req.body.name : ""
    let phone_no = req.body.phone_no ? req.body.phone_no : ""
    let email = req.body.email ? req.body.email : ""
    if (phone_no != "") {
        let playercreated = await playerService.create({
            user_name: name,
            phone_no: phone_no,
            email:email
        }).catch(e => next(e))

        if (playercreated && JSON.stringify(playercreated) !== "{}") {
            errMsg = "success";
            errCode = 0;
            res.send(baseController.generateResponse(errCode, errMsg, { player: playercreated }));
        }
    }
    else {
        res.send(baseController.generateResponse(errCode, errMsg));
    }
}


module.exports = {
    createPlayer
}