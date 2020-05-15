const couple = require('../couple');
const waiting = require('../waiting');
const user = require('../user');

const language = require('../../../custom/language');
const facebook = require('../platform/facebook');


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
            text.message.text;
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

                // TODO: Countinue code

            })
        })


    }
}