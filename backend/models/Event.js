const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema({

  title: String,

  date: Date,

  location: String,

  volunteersNeeded: Number,

  duration: String,

  foodProvided: Boolean,

  reward: String,

  description: String,

  volunteers: {
    type: [String],
    default: []
  },

  completed: {
    type: Boolean,
    default: false
  }

});

module.exports = mongoose.model("Event", EventSchema);