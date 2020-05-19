const axios = require('axios');
const https = require('https');
const config = require('../../../custom/config')
const language = require('../../../custom/language');
var heroku = null;

if (config.HEROKU_API_KEY) {
    var Heroku = require('heroku-client');
    heroku = new Heroku({ token: config.HEROKU_API_KEY });
}


exports.getUserData = (accessToken, apiPath, callback) => {
    var options = {
        host: 'graph.facebook.com',
        port: 443,
        path: `/${apiPath}?access_token=${accessToken}`, //apiPath example: '/me/friends'
        method: 'GET'
    };

    var buffer = ''; //this buffer will be populated with the chunks of the data received from facebook
    var request = https.get(options, (result) => {
        result.setEncoding('utf8');
        result.on('data', (chunk) => {
            buffer += chunk;
        });

        result.on('end', () => {
            try {
                var data = JSON.parse(buffer);
                callback(data);
            } catch (e) {
                callback({ error: true });
            }
        });
    });
    request.on('error', (e) => {
        console.log('error from facebook.getFbData: ' + e.message);
        callback({ "error": "facebook.getData Error" });
    });
    request.end();
}

exports.setupFacebookAPI = (token) => {
    axios({
        url: "https://graph.facebook.com/v7.0/me/messenger_profile",
        params: { access_token: token },
        method: 'POST',
        data: {
            "get_started": {
                "payload": "ʬ"
            }
        }
    }).then((res) => {
        console.log(res.data);
    });
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

exports.sendTextMessage = (receiver, txt) => {
    sendFacebookAPI(receiver, receiver, { text: txt });
}

exports.sendMessageButtons = (sender, text, showStartButton, showHelpButton, showReportButton = false) => {
    var buttons = [];
    if (showStartButton) buttons.push({
        "type": "postback",
        "title": "Bắt đầu chat",
        "payload": "batdau"
    });
    if (showHelpButton) buttons.push({
        "type": "postback",
        "title": "Xem trợ giúp",
        "payload": "trogiup"
    });
    else buttons.push({
        "type": "web_url",
        "title": "Gửi phản hồi",
        "url": config.REPORT_LINK
    });
    if (showReportButton)
        buttons.push({
            "type": "web_url",
            "title": "Gửi phản hồi",
            "url": config.REPORT_LINK
        });
    sendFacebookAPI(sender, sender, {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "button",
                "text": text,
                "buttons": buttons
            }
        },
        "quick_replies": this.quickButtons
    }, {});
}

exports.quickButtons = [
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
var sendFacebookAPI = (sender, receiver, messageData, dontSendError = false) => {
    // console.log(messageData);
    if (messageData.text || messageData.attachment) {
        if (messageData.text && messageData.text.length > 639) {
            sendFacebookAPI(sender, sender, { text: language.ERR_TOO_LONG }, true);
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
                console.log(response.data);
                if (response.data.error && response.data.error.code && !dontSendError) {
                    console.log(sender + 'vs' + receiver + ' Error: ', response.data.error);
                    if (response.data.error.code == 200)
                        sendFacebookAPI(sender, sender, { text: language.ERR_200 }, null, true);
                    else if (response.data.error.code == 10)
                        sendFacebookAPI(sender, sender, { text: language.ERR_10 }, null, true);
                    else if (config.HEROKU_API_KEY && response.data.error.code == 5)
                        heroku.delete(`/apps/${config.APP_NAME}/dynos`, () => { });
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

exports.sendFacebookAPI = sendFacebookAPI;

exports.sendSeenIndicator = (receiver) => {
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
    if (messageData.mid) sendFacebookAPI(sender, receiver, {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "button",
                "text": "[Chatbot] Partner gửi cho bạn 1 " + type,
                "buttons": [{ "type": "web_url", "title": "Báo cáo/Report", "url": config.REPORT_LINK }]
            }
        }
    });
}

