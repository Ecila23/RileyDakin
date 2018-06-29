var mongoose = require("mongoose");

var RsvpSchema = new mongoose.Schema({
    name: String,
    author: {
      id: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User"
      },
      email: String
    },
    attending: String,
    diet: String,
    song: String
});

module.exports = mongoose.model("Rsvp", RsvpSchema);