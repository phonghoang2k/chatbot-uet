const Couple = require('../models/couple');
const { handleSuccess, handleError } = require('../helpers/response');
const axios = require('axios');
const config = require('../../custom/config');
var waiter = require('./core/waiting');
const Waiter = require('../models/waiting')
const User = require('../models/user')
var user = require("./core/user");
var facebook = require("./platform/facebook");
const token = 'EAAItZAekgTxABACOF0mxkgPhoztvo9G3PChPB7VcLtcoUcEAlhgi6g4db3ua9hiLhIJHFwotFeNj2cYgLzEOAXjUFytlHHexvrw0RJMXDpThc8Xn7kqoQIlJ5SbQCZBHvu4MwSxxl0A3a3546P1dXoEG0YkqCo9eqenwGuGqZBVD5UbZAIOOIOAZBuVLJzGsZD';
const id = '3294845787206281';
const utils = require('./utils');

module.exports.verify = async (req, res, next) => {
    // let couples = await user.getPreferedGender(id, facebook, token, (doc) => {
    //     handleSuccess(res, doc);
    // });

    // couple.addNew("233123", "4331234", true);
    // await facebook.sendImageVideoReport({
    //     mid: "a",
    //     attachments: [{
    //         type: "image",
    //         payload: {
    //             attachment_id: "174550458999123"
    //         }
    //     }]
    // }, "1531043043663202", "1531043043663202")

    // await facebook.getFacebookData(token, id, (data) => {
    //     console.log(data); 
    // })
    // handleSuccess(res, { 
    //     result: "done"
    // });

    // await waiter.list((data) => {
    //     res.send(data);
    // })

    if (req.query['hub.verify_token'] === config.FB_PAGE_VERIFY_TOKEN) {
        res.send(req.query['hub.challenge']);
    } else {
        res.send('Error, wrong token');
    }
}

module.exports.postData = async (req, res, next) => {
    if (!req.isXHub || !req.isXHubValid()) {
        res.send('ERR: cannot verify X-Hub Signature');
        return;
    }

    res.sendStatus(200);
    let messaging_events = req.body.entry[0].messaging;
    for (let i = 0; i < messaging_events.length; i++) {
        utils.processEvent(messaging_events[i]);
    }


    // let body = req.body;

    // var couple_data = {
    //     // id1: body.id1,
    //     // id2: body.id2,
    //     // startTime: (new Date()).getTime(),
    //     // isGenderMatched: true

    //     // userId: body.id,
    //     // preferedGender: body.preferedGender,
    //     // time: (new Date()).getTime()

    //     userId: body.userId,
    //     preferedGender: body.preferedGender

    // }
    // console.log(couple_data);
    // let user = new User(couple_data);
    // await user.save();
    // handleSuccess(res, couple);
} 