const Claim = require("../models/Claim");

const get = async (where, limit) => new Promise((resolve, reject) => {
    limit = limit || 10;
    where = where || {};
    Claim.find(where)
        .limit(limit)
        .exec((err, doc) => (err ? reject(err) : resolve(doc)));
});

const search = async (where) => new Promise((resolve, reject) => {
    where = where || {};
    Claim.find(where)
        .exec((err, doc) => (err ? reject(err) : resolve(doc)));
});

const getCount = async (where) => new Promise((resolve, reject) => {
    where = where || {};
    Claim.countDocuments(where)
        .exec((err, doc) => (err ? reject(err) : resolve(doc)));
});

const update = async (where, ClaimObj) => new Promise((resolve, reject) => {
    Claim.where(where).updateOne(ClaimObj, (err, count) =>
        err ? reject(err) : resolve(count)
    );
});


const create = async (ClaimObj) => new Promise((resolve, reject) => {
    var claim = new Claim(ClaimObj);
    claim
        .save()
        .then(Claim => resolve(Claim))
        .catch(e => reject(e));
});

const createMany = async (ClaimObj) =>
    new Promise((resolve, reject) => {
        Claim.insertMany(ClaimObj, (err, count) =>
            err ? reject(err) : resolve(count))
    });



module.exports = {
    get,
    search,
    create,
    update,
    getCount,
    createMany
}