const Couple = require('../models/couple');
const { handleSuccess, handleError } = require('../helpers/response');
var couple = require('./couple');
var waiter = require('./waiting');
const Waiter = require('../models/waiting')

module.exports.verify = async (req, res, next) => {
    let couples = await waiter.list((doc) => {
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

        userId: body.id,
        preferedGender: body.preferedGender,
        time: (new Date()).getTime()
    }
    console.log(couple_data);
    let couple = new Waiter(couple_data);
    await couple.save();
    handleSuccess(res, couple);
}