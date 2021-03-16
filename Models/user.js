const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    token: String,
    tokenExpirationDate: Date
})

const User = mongoose.model("user", userSchema);

module.exports = User; 

// Någon hantering för schema gällande begränsning av tecken?
