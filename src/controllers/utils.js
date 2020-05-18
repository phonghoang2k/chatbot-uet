const couple = require('./core/couple');
const waiting = require('./core/waiting');
const user = require('./core/user');

const config = require('../../custom/config');
const language = require('../../custom/language');
const facebook = require('./platform/facebook');

function findPair(id, mygender) {
    // first fetch list waitroom
    //(list, genderlist)
    waiting.list((data) => {
        for (let i = 0; i <= data.length; i++) {
            if (i === data.length) {
                // if no one suitable, waiting
                if (mygender == "None") facebook.sendTextMessage(id, language.START_WARN_GENDER);
                waiting.addNew(id, mygender);
                facebook.sendTextMessage(id, language.START_OKAY);
                return;
            }
            let target = data[i].userId;
            let target_gender = data[i].preferedGender;

            let isGenderMatched = (mygender == 'None' && target_gender == 'None') ||
                (mygender == 'Male' && target_gender == 'Female') ||
                (mygender == 'Female' && target_gender == 'Male');
            if (data.length > config.MAX_PEOPLE_WAITROOM ||
                ((mygender == 'None' || target_gender == 'None') && Math.random() > 0.8)) {
                // connect if there're so many people waiting
                // or connect people who haven't choose preferedGender
                console.log("aaaaaaaa");
                connect2People(id, target, isGenderMatched);
                return;
            } else {
                // can choose people base on their preferGender
                if (isGenderMatched) {
                    connect2People(id, target, true);
                    return;
                } else {
                    // next :)
                    continue;
                }
            }
        }
    }
    );
}

function connect2People(id, target, isGenderMatched) {
    waiting.deleteUser(target);
    couple.addNew(id, target, isGenderMatched);
    facebook.sendTextMessage(id, language.START_CHAT);
    facebook.sendTextMessage(target, language.START_CHAT);
}

function processEndChat(id1, id2) {
    couple.deleteUser(id1, () => {
        facebook.sendMessageButtons(id1, language.END_CHAT, true, true, true);
        facebook.sendMessageButtons(id2, language.END_CHAT_PARTNER, true, true, true);
    });
}

function forwardMessage(sender, receiver, data) {
    if (data.attachments) {
        if (data.attachments[0]) {
            let messageData = {};
            let type = data.attachments[0].type;
            if (type === 'fallback') {
                if (data.text)
                    messageData.text = data.text;
                else
                    messageData.text = language.ATTACHMENT_LINK + data.attachments[0].url;
            } else if (!data.attachments[0].payload || !data.attachments[0].payload.url) {
                facebook.sendTextMessage(sender, language.ERR_ATTACHMENT);
                return;
            } else if (type === 'image' || type === 'video' || type === 'audio' || type === 'file') {
                messageData.attachment = {
                    'type': type,
                    'payload': {
                        'url': data.attachments[0].payload.url
                    }
                };
                //fb.sendImageVideoReport(data, sender, receiver);
            } else {
                facebook.sendTextMessage(sender, language.ERR_ATTACHMENT);
                return;
            }
            facebook.sendFacebookAPI(sender, receiver, messageData);
        }

        for (let i = 1; i < data.attachments.length; i++) {
            let type = data.attachments[i].type;
            if (type === 'image' || type === 'video' || type === 'audio' || type === 'file') {
                facebook.sendFacebookAPI(sender, receiver, {
                    attachment: {
                        'type': type,
                        'payload': {
                            'url': data.attachments[i].payload.url
                        }
                    }
                });
            }
        }
    } else {
        facebook.sendFacebookAPI(sender, receiver, { text: data.text });
    }
}


exports.processEvent = (event) => {
    console.log(event);
    if (event.read) {
        event.message = {
            text: ""
        };
    }
    let sender = event.sender.id;
    if (event.postback && event.postback.payload) {
        event.message = {
            "text": event.postback.payload,
        };
    }

    if (event.message) {
        // test
        if (event.message.delivery) {
            return
        }

        let text = "";
        if (event.message.quick_reply && event.message.quick_reply.payload) {
            text = event.message.quick_reply.payload;
        }
        else if (event.message.text) {
            text = event.message.text;
        }

        // fetch user state
        waiting.find(sender, (waitstate) => {
            couple.findPartner(sender, (sender2) => {
                let command = "";
                if (text.length < 20) {
                    command = text.toLowerCase().replace(/ /g, '');
                }

                if (command === 'ʬ') {
                    facebook.sendMessageButtons(sender, language.FIRST_COME, true, true);
                    return;
                }

                if (!waitstate && sender2 === null) {
                    // not in chatrooms or waitrooms
                    if (command === language.KEYWORD_START) {
                        user.getPreferedGender(sender, (gender) => {
                            findPair(sender, gender);
                        })
                    } else if (command.startsWith(language.KEYWORD_GENDERPREFER)) {
                        user.setPreferedGender(sender, command, (id, message) => {
                            switch (message) {
                                case "found nothing": {
                                    facebook.sendTextMessage(id, language.GENDER_ERR);
                                    break;
                                }
                                case "error": {
                                    facebook.sendTextMessage(id, language.DATABASE_ERR);
                                    break;
                                }
                                default: {
                                    facebook.sendTextMessage(id, `${language.GENDER_WRITE_OK} ${message} ${language.GENDER_WRITE_WARN}`);
                                    findPair(id, message);
                                }
                            }
                        });
                    } else if (command == language.KEYWORD_HELP) {
                        facebook.sendMessageButtons(sender, language.HELP_TXT, true, false);
                    } else if (!event.read) {
                        facebook.sendMessageButtons(sender, language.INSTRUCTION, true, true);
                    }
                } else if (waitstate && sender2 === null) {
                    // in waitrooms and still waiting
                    if (command == language.KEYWORD_END) {
                        waiting.deleteUser(sender);
                        facebook.sendMessageButtons(sender, language.END_CHAT, true, true);
                    } else if (command == language.KEYWORD_HELP) {
                        facebook.sendMessageButtons(sender, language.HELP_TXT, false, false);
                    } else if (!event.read) {
                        facebook.sendMessageButtons(sender, language.WAITING, false, true);
                    }
                } else if (!waitstate && sender2 !== null) {
                    if (command === language.KEYWORD_END) {
                        processEndChat(sender, sender2);
                    } else if (command == language.KEYWORD_START) {
                        facebook.sendTextMessage(sender, language.START_ERR_ALREADY);
                    } else if (command == language.KEYWORD_HELP) {
                        facebook.sendMessageButtons(sender, language.HELP_TXT, false, false);
                    } else { 
                        if (event.read) {
                            facebook.sendSeenIndicator(sender2);
                        } else if (text.trim().toLowerCase().startsWith('[bot]')) {
                            facebook.sendTextMessage(sender, language.ERR_FAKE_MSG);
                        } else {
                            forwardMessage(sender, sender2, event.message);

                        }
                    }
                } else {
                    facebook.sendTextMessage(sender, language.ERR_UNKNOWN);
                    waiting.deleteUser(sender);
                    couple.deleteUser(sender, () => { });
                }
                // TODO: Countinue code
            })
        })
    }
}