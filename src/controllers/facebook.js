const Couple = require('../models/chatroom');
const { handleSuccess, handleError } = require('../helpers/response');


module.exports.verify = async (req, res, next) => {
    let couples = await Couple.find();
    handleSuccess(res, couples);
}

module.exports.postData = async (req, res, next) => {
    let body = req.body;
    var couple_data = {
        id1: body.id1,
        id2: body.id2,
        startTime: (new Date()).getTime(),
        isGenderMatched: true
    }
    console.log(couple_data);
    let couple = new Couple(couple_data);
    await couple.save();
    handleSuccess(res, couple);
}