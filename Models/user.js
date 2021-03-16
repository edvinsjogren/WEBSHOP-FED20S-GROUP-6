const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: "Member" },
  token: String,
  tokenExpirationDate: Date,
  donations: [
    {
      donationId: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
      donationAmount: { type: Number },
    },
  ],
});

userSchema.methods.addDonation = function (projectId, donation) {
  this.donations.push(projectId);
  this.donations.donationAmount.push(donation);
  this.save()
};

const User = mongoose.model("user", userSchema);

module.exports = User;