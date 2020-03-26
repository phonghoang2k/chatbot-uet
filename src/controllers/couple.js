const Couple = require('../models/couple');

module.exports.addNew = async function (id1, id2, isGenderMatched) {
    let data = {
        id1: id1,
        id2: id2,
        startTime: (new Date()).getTime(),
        isGenderMatched: isGenderMatched
    }
    let couple = new Couple(data);
    await couple.save(function (err) {
        if (err) {
            console.log('__writeToChatRoom error: ', err);
            setTimeout(() => this.addNew(id1, id2, isGenderMatched), 1000);
        }
    });
}
/**
 * @callback callback(id,haveToReview,role,data);
 */

module.exports.findPartner = async function (id, callback) {
    Couple.find({ $or: [{ id1: id }, { id2: id }] }, (err, doc) => {
        if (err) {
            console.log('__findPartnerChatRoom error: ', err);
            setTimeout(() => findPartner(id, callback), 1000);
        } else if (doc) {
            console.log(doc[0].id1 == id);
            if (doc[0].id1 == id) {
                callback(doc[0].id2, false, 1, doc[0]);
            } else {
                callback(doc[0].id1, false, 2, doc[0]);
            }
        } else {
            callback(null, false, 1, {});
        }
    })
}

module.exports.deleteUser = async function (id, callback) {
    Couple.find({
        $or: [{ "id1": id }, { "id2": id }]
    }, async (err, doc) => {
        await Couple.deleteMany({ $or: [{ id1: id }, { id2: id }] });
        if (!err && doc) {
            callback(doc[0]);
        } else {
            setTimeout(() => this.deleteUser(id, callback), 1000);
        }
    })
}
module.exports.list = async function (callback) {
    Couple.find((err, doc) => {
        if (err) {
            console.log('__getListWaitRoom error: ', err);
            setTimeout(() => this.list(callback), 1000);
        } else {
            callback(doc);
        }
    });
}