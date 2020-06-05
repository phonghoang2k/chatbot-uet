var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var user_schema = new Schema({
    userId: { type: String, required: true },
    preferedGender: { type: String, default: "None" },
});

user_schema.index({ userId: 1 });

var User = mongoose.model("User", user_schema);
module.exports = User;
