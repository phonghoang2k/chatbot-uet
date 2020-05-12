const Couple = require('../models/couple');
const { handleSuccess, handleError } = require('../helpers/response');
var couple = require('./couple');
var waiter = require('./waiting');
const Waiter = require('../models/waiting')
const User = require('../models/user')
var user = require("./user");
var facebook = require("./facebook");

module.exports.verify = async (req, res, next) => {
    let couples = await user.getPreferedGender(21, facebook, "token", (doc) => {
        handleSuccess(res, doc);
    });
    // handleSuccess(res, couples);
}

module.exports.postData = async (req, res, next) => {
    let body = req.body;

    var couple_data = {
        // id1: body.id1,
        // id2: body.id2,
        // startTime: (new Date()).getTime(),
        // isGenderMatched: true

        // userId: body.id,
        // preferedGender: body.preferedGender,
        // time: (new Date()).getTime()

        userId: body.userId,
        preferedGender: body.preferedGender

    }
    console.log(couple_data);
    let user = new User(couple_data);
    await user.save();
    handleSuccess(res, couple);
}