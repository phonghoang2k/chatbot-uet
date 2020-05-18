const User = require('../../models/user');
const config = require('../../../custom/config');
const language = require('../../../custom/language');
const facebook = require('../platform/facebook');

module.exports.setPreferedGender = async function (id, genderString, callback) {
    var preferedGender = "";
    switch (genderString) {
        case language.KEYWORD_GENDERPREFER + 'nam': {
            preferedGender = 'Male';
            break;
        }
        case language.KEYWORD_GENDERPREFER + 'nu': {
            preferedGender = "Female";
            break;
        }
        case language.KEYWORD_GENDERPREFER + 'hong': {
            preferedGender = "None";
            break;
        }
        default: {
            callback(id, "found nothing");
        }
    }

    User.findOneAndUpdate({ userId: id }, {
        userId: id,
        preferedGender: preferedGender
    }, (err) => {
        if (err) {
            callback(-id, "error");
            console.log(err);
        } else {
            callback(id, preferedGender);
        }
    })
}

module.exports.getPreferedGender = async function (id, callback) {
    User.findOne({ userId: id }, (err, doc) => {
        if (err) {
            callback("error");
        }
        else {
            if (doc !== null) {
                callback(doc.preferedGender);
            } else {
                facebook.getUserData(config.FB_PAGE_ACCESS_TOKEN, id, (data) => {
                    console.log(data);
                    if (!data.gender) {
                        this.setPreferedGender(id, language.KEYWORD_GENDERPREFER + 'hong', () => { });
                        callback('None');
                    } else if (data.gender == "male") {
                        this.setPreferedGender(id, language.KEYWORD_GENDERPREFER + 'nam', () => { });
                        callback('Male');
                    } else {
                        this.setPreferedGender(id, language.KEYWORD_GENDERPREFER + 'nu', () => { });
                        callback('Female');
                    }
                })

            }
        }
    })
}