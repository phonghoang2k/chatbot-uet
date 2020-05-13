const axios = require('axios');
const https = require('https');
const config = require('../../custom/config')
const language = require('../../custom/language');


exports.getFacebookData = (accessToken, apiPath, callback) => {
    var options = {
        host: 'graph.facebook.com',
        port: 443,
        path: `/${apiPath}?access_token=${accessToken}`, //apiPath example: '/me/friends'
        method: 'GET'
    };
    //temporatory
    // callback({
    //     gender: "female"
    // });

    var buffer = ''; //this buffer will be populated with the chunks of the data received from facebook
    var request = https.get(options, function (result) {
        result.setEncoding('utf8');
        result.on('data', function (chunk) {
            buffer += chunk;
        });

        result.on('end', function () {
            try {
                var data = JSON.parse(buffer);
                callback(data);
            } catch (e) {
                callback({ error: true });
            }
        });
    });
    request.on('error', function (e) {
        console.log('error from facebook.getFbData: ' + e.message);
        callback({ "error": "facebook.getData Error" });
    });
    request.end();
}

exports.setupFacebookAPI = (axios, token) => {
    axios({
        url: "https://graph.facebook.com/v7.0/me/messenger_profile",
        params: { access_token: token },
        method: 'POST',
        data: {
            "get_started": {
                "payload": "ʬ"
            }
        }
    }).then((res) => { });
    axios({
        url: "https://graph.facebook.com/v7.0/me/thread_settings",
        params: { access_token: token },
        method: 'DELETE',
        data: {
            "setting_type": "call_to_actions",
            "thread_state": "existing_thread"
        }
    }).then((res) => {
        console.log(res.data);
    })
}

exports.quickBtns = [
    {
        "content_type": "text",
        "title": "tìm partner nam",
        "payload": language.KEYWORD_GENDERPREFER + 'nam'
    }, {
        "content_type": "text",
        "title": "tìm partner nữ",
        "payload": language.KEYWORD_GENDERPREFER + 'nu'
    }, {
        "content_type": "text",
        "title": "trợ giúp",
        "payload": language.KEYWORD_HELP
    }
];

/**
 * @Before sender, receiver, messageData, data, dontSendErr
 * 
 * @After sender, receiver, messageData, dontSendError
 */

module.exports.sendFacebookAPI = (sender, receiver, messageData, dontSendError) => {
    if (messageData.text || messageData.attachment) {
        if (messageData.text && messageData.text.length > 639) {
            this.sendFacebookAPI(sender, sender, { text: language.ERR_TOO_LONG }, true);

            return;
        }

        axios({
            url: "https://graph.facebook.com/v7.0/me/messages",
            params: { access_token: config.FB_PAGE_ACCESS_TOKEN },
            method: 'POST',
            data: {
                recipient: { id: receiver },
                message: messageData,
                messaging_type: "RESPONSE"
            }
        })
            .then((response) => {
                console(response.data);
                if (response.data.error && response.data.error.code && !dontSendError) {
                    console.log(sender + 'vs' + receiver + ' Error: ', response.data.error);
                    if (response.data.error.code == 200)
                        this.sendFacebookAPI(sender, sender, { text: language.ERR_200 }, null, true);
                    else if (response.data.error.code == 10)
                        this.sendFacebookAPI(sender, sender, { text: language.ERR_10 }, null, true);
                    else if (co.HEROKU_API_KEY && response.data.error.code == 5)
                        heroku.delete('/apps/' + co.APP_NAME + '/dynos/web.1', function (err, app) { });
                }
            })
            .catch((error) => {
                console.log('Error sending messages: ', error)
            })
    } else {
        console.log("__sendMessage: err: neither text nor attachment");
        console.log(messageData);
    }
}

exports.sendSeenIndicator = function (receiver) {
    axios({
        url: 'https://graph.facebook.com/v7.0/me/messages',
        params: { access_token: config.FB_PAGE_ACCESS_TOKEN },
        method: 'POST',
        data: {
            recipient: { id: receiver },
            sender_action: "mark_seen",
            messaging_type: "RESPONSE"
        }
    });
}

exports.sendImageVideoReport = (messageData, sender, receiver) => {
    if (messageData.sticker_id) return;
    let type = "ảnh";
    if (messageData.attachments[0].type == "video") type = "video";
    else if (messageData.attachments[0].type == "audio") return;
    if (messageData.mid) this.sendFacebookAPI(sender, receiver, {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "button",
                "text": "[Chatbot] Bạn đã nhận được 1 " + type,
                "buttons": [{ "type": "web_url", "title": "Báo cáo/Report", "url": config.REPORT_LINK }]
            }
        }
    });
}
