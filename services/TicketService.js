const Ticket = require("../models/Ticket");

const get = async (where, limit) => new Promise((resolve, reject) => {
    limit = limit || 10;
    where = where || {};
    Ticket.find(where)
        .limit(limit)
        .exec((err, doc) => (err ? reject(err) : resolve(doc)));
});

const getCount = async (where) => new Promise((resolve, reject) => {
    where = where || {};
    Ticket.countDocuments(where)
        .exec((err, doc) => (err ? reject(err) : resolve(doc)));
});

const update = async (where, TicketObj) => new Promise((resolve, reject) => {
    Ticket.where(where).updateOne(TicketObj, (err, count) =>
        err ? reject(err) : resolve(count)
    );
});

const updateMany = async (where, TicketObj) => new Promise((resolve, reject) => {
    Ticket.where(where).updateMany(TicketObj, (err, count) =>
        err ? reject(err) : resolve(count)
    );
});



const create = async (TicketObj) => new Promise((resolve, reject) => {
    var ticket = new Ticket(TicketObj);
    ticket
        .save()
        .then(Ticket => resolve(Ticket))
        .catch(e => reject(e));
});

const createMany = async (gameObj) =>
    new Promise((resolve, reject) => {
        Game.insertMany(gameObj, (err, count) =>
            err ? reject(err) : resolve(count))
    });

const search = async (where) => new Promise((resolve, reject) => {
    where = where || {};
    Ticket.find(where)
        .exec((err, doc) => (err ? reject(err) : resolve(doc)));
});


module.exports = {
    get,
    search,
    create,
    update,
    updateMany,
    getCount,
    createMany
}