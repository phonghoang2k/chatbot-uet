var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var chatroom_schema = new Schema(
    {
        id1: { type: String, required: true },
        id2: { type: String, required: true },
        startTime: { type: Date, required: true },
        isGenderMatched: { type: Boolean, required: true },
    })

chatroom_schema.index({ id1: 1, id2: 1 }, { unique: true });

chatroom_schema.pre('save', function (error, pair, next) {
    if (error.name === 'MongoError' && error.code === 11000) {
        error.message = `Đã tồn tại`;
        throw error;
    }
    next();
})

var Chatroom = mongoose.model('Chatroom', chatroom_schema);
module.exports = Chatroom;