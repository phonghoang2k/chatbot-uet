const Couple = require('../models/couple');
const { handleSuccess, handleError } = require('../helpers/response');
const axios = require('axios');
var couple = require('./couple');
var waiter = require('./waiting');
const Waiter = require('../models/waiting')
const User = require('../models/user')
var user = require("./user");
var facebook = require("./facebook");
const token = 'EAAG7WfEhGK0BADqxAYZAAxnVMGZCE6qpLBqLZCsM9rCiqTxKnDQ9msX7ZCPEzUXHctcM1W5TcNHKZAqD6CrfkZBPwNA5ZCxj4wIDNuZAZC5TZCwP05Br1SzckdpMzCetUQppZAFOxzSEcintxwVMIgQ7ueSua4Fm81oNz0Tx1iRKqWrFbFGAiiZARZACENIx7QV0fALIZD';
const id = '2855691427779771';

module.exports.verify = async (req, res, next) => {
    // let couples = await user.getPreferedGender(id, facebook, token, (doc) => {
    //     handleSuccess(res, doc);
    // });
    await facebook.sendImageVideoReport({
        attachments: [{
            type: "image",
            payload: {
                attachment_id: "1745504518999123"
            }
        }]
    }, "1531043043663202", "1531043043663202")
    handleSuccess(res, {
        result: "done"
    });
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