const { handleSuccess } = require('../../helpers/response');
const config = require('../../../custom/config');

var couple = require('../couple');
var waiter = require('../waiting');
var user = require("../user");
var facebook = require("../facebook");


module.exports.verify = async (req, res, next) => {
    if (req.query['hub.verify_token'] === config.FB_PAGE_VERIFY_TOKEN) {
        res.send(req.query['hub.challenge'])
    } else {
        res.send('Error, wrong token') 
    }
}

module.exports.postData = async (req, res, next) => {

}