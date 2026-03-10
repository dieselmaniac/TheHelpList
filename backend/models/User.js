const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, default: "volunteer" },
  profilePhoto: String,
  stars: { type: Number, default: 0 },
  eventsAttended: [String]
});

module.exports = mongoose.model("User", UserSchema);