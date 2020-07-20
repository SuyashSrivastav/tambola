const Player = require("../models/Player");

const get = async (where, limit) => new Promise((resolve, reject) => {
    limit = limit || 10;
    where = where || {};
    Player.find(where)
        .limit(limit)
        .exec((err, doc) => (err ? reject(err) : resolve(doc)));
});
const getCount = async (where) => new Promise((resolve, reject) => {
    where = where || {};
    Player.countDocuments(where)
        .exec((err, doc) => (err ? reject(err) : resolve(doc)));
});

const update = async (where, playerObj) => new Promise((resolve, reject) => {
    Player.where(where).updateOne(playerObj, (err, count) =>
        err ? reject(err) : resolve(count)
    );
});


const create = async (playerObj) => new Promise((resolve, reject) => {
    var player = new Player(playerObj);
    player
        .save()
        .then(player => resolve(player))
        .catch(e => reject(e));
});

const getPlayerIdArray = async (where) => new Promise((resolve, reject) => {

    Player.aggregate([
        { $match: where },
        {
            $group: {
                _id: null,
                player_id_array: { $addToSet: '$_id'  }
            }
        }
    ])
        .exec((err, doc) => (err ? reject(err) : resolve(doc)));
});


module.exports = {
    get,
    create,
    update,
    getCount,
    getPlayerIdArray
}