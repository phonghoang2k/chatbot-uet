const Waiting = require('../models/waiting');

module.exports.addNew = async function (id, preferedGender) {
    let data = {
        userId: id,
        preferedGender: preferedGender,
        time: (new Date()).getTime()
    }
    let waiter = new Waiting(data);
    await waiter.save(function (err) {
        if (err) {
            console.log('__writeToWaitRoom error: ', err);
            setTimeout(() => this.addNew(id, preferedGender), 1000);
        }
    });
}

module.exports.find = async function (id, callback) {
    Waiting.findOne({ userId: id }, (err, doc) => {
        if (err) {
            console.log('__findInWaitRoom error: ', err);
            callback(false);
        } else if (doc) {
            callback(true);
        } else {
            callback(false);
        }
    })
}

module.exports.deleteUser = async function (id) {
    Waiting.deleteMany({ userId: id }, (err) => {
        if (err) {
            console.log('__deleteFromWaitRoom error: ', err);
            setTimeout(() => this.deleteUser(id), 1000);
        }
    })
}

module.exports.list = async function (callback) {
    Waiting.find({}, (err, doc) => {
        if (err) {
            console.log('__getListWaitRoom error: ', err);
            callback({});
        } else {
            callback(doc);
        }
    });
}