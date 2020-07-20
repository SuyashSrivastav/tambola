const Game = require("../models/Game");

const get = async (where, limit) => new Promise((resolve, reject) => {
    limit = limit || 10;
    where = where || {};
    Game.find(where)
        .limit(limit)
        .exec((err, doc) => (err ? reject(err) : resolve(doc)));
});

const search = async (where) => new Promise((resolve, reject) => {
    where = where || {};
    Game.find(where)
        .exec((err, doc) => (err ? reject(err) : resolve(doc)));
});

const getCount = async (where) => new Promise((resolve, reject) => {
    where = where || {};
    Game.countDocuments(where)
        .exec((err, doc) => (err ? reject(err) : resolve(doc)));
});

const update = async (where, GameObj) => new Promise((resolve, reject) => {
    Game.where(where).updateOne(GameObj, (err, count) =>
        err ? reject(err) : resolve(count)
    );
});


const create = async (GameObj) => new Promise((resolve, reject) => {
    var game = new Game(GameObj);
    game
        .save()
        .then(Game => resolve(Game))
        .catch(e => reject(e));
});

const createMany = async (gameObj) =>
    new Promise((resolve, reject) => {
        Game.insertMany(gameObj, (err, count) =>
            err ? reject(err) : resolve(count))
    });


const getNumberArray = async (where) => new Promise((resolve, reject) => {

    where = where || {};
    Game.aggregate([
        { $match: where },
        { $unwind: '$numbers_drawn' },
        { $sort: { 'numbers_drawn.time': 1 } },
        {
            $group: {
                _id: '$_id',
                numbers: { $push: '$numbers_drawn.number' }
            }
        }
    ])
        .exec((err, doc) => (err ? reject(err) : resolve(doc)));
});


const getGameStats = async (where) => new Promise((resolve, reject) => {

    where = where || {};
    Game.aggregate([
        { $match: where },
        { $unwind: '$numbers_drawn' },
        { $sort: { 'numbers_drawn.time': 1 } },
        {
            $group: {
                _id: '$_id',
                name: { $first: '$name' },
                players_joined: { $first: '$players_joined' },
                numbers: { $push: '$numbers_drawn.number' }
            }
        },
        {
            $lookup: {
                from: 'tickets',
                let: { game_id: "$_id" },
                pipeline: [
                    {
                        $match:
                            { $expr: { $eq: ["$game_id", "$$game_id"] } }
                    },
                    {
                        $lookup: {
                            from: 'players',
                            let: { player_id: '$player_id' },
                            pipeline: [
                                {
                                    $match: {
                                        $expr: {
                                            $and: [
                                                { $eq: ["$_id", "$$player_id"] }, { $eq: ["$is_active", true] }]
                                        }
                                    }
                                },
                                { $project: { user_name: 1 } }],
                            as: 'players'
                        }
                    },
                    {
                        $project: {
                            ticket_id: '$_id',
                            user_name: { $arrayElemAt: ['$players.user_name', 0] },
                            number_of_cutoff: { $size: '$cut_off_numbers' },
                            _id: 0
                        }
                    }
                ],
                as: 'tickets'
            }
        },
        {
            $project: {
                game_name: '$name',
                game_id: '$_id',
                number_of_users: { $size: '$players_joined' },
                generated_numbers: '$numbers',
                number_of_tickets: { $size: '$tickets' },
                ticket_details: '$tickets',
                _id: 0
            }
        }
    ])
        .exec((err, doc) => (err ? reject(err) : resolve(doc)));
});



module.exports = {
    get,
    search,
    create,
    update,
    getCount,
    createMany,
    getNumberArray,
    getGameStats
}