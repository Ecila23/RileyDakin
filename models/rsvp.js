var mongoose = require("mongoose");

var RsvpSchema = new mongoose.Schema({
    name: String,
    email: String,
    attending: String,
    diet: String,
    song: String
});

module.exports = mongoose.model("Rsvp", RsvpSchema);