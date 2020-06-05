var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var waiting_schema = new Schema({
    userId: { type: String, required: true },
    preferedGender: { type: String, required: true },
    time: { type: Number, required: true },
});

waiting_schema.index({ userId: 1 }, { unique: true });

var Waiting = mongoose.model("Waitroom", waiting_schema);
module.exports = Waiting;
