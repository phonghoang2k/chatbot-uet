var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var couple_schema = new Schema({
    id1: { type: String, required: true },
    id2: { type: String, required: true },
    startTime: { type: Number, required: true },
    isGenderMatched: { type: Boolean, required: true },
});

couple_schema.index({ id1: 1, id2: 1 }, { unique: true });

var Couple = mongoose.model("Chatroom", couple_schema);
module.exports = Couple;
