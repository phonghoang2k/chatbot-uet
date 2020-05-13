const User = require('../models/user');
const language = require('../../custom/language');

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

module.exports.getPreferedGender = async function (id, facebook, token, callback) {
    User.findOne({ userId: id }, (err, doc) => {
        if (err) {
            callback("error");
        }
        else {
            if (doc !== null) {
                callback(doc.preferedGender);
            } else {
                facebook.getFacebookData(token, id, (data) => {
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