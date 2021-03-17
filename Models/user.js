const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {type: String, required: true},
  email: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  role: {type: String, default: "Member"},
  token: String,
  tokenExpirationDate: Date,
});

const User = mongoose.model("user", userSchema);

module.exports = User;
