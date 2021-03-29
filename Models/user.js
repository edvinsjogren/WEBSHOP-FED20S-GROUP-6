const mongoose = require("mongoose");
const Joi = require("joi");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {type: String, unique: true, required: true},
  password: {type: String, required: true},
  role: String,
  token: String,
  tokenExpirationDate: Date,
  donations: {
    projects: [
      {
        projectID: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Project",
        },
        donationAmount: {type: Number},
      },
    ],
  },
});

userSchema.methods.addDonation = function (incomingProjectID, donation) {
  // updatedProject is a copy of the projects array in the user-schema
  const updatedProject = [...this.donations.projects];

  console.log("Added a new donation to your chosen donation... ");

  // Collect project-id and donationAmount and push them in the objects in the array-element
  updatedProject.push({
    projectID: incomingProjectID,
    donationAmount: donation,
  });

  //Create a copy of the donations object in the schema and add the array to the copy
  const updatedDonation = {
    projects: updatedProject,
  };

  //Update the donations with the updatedDonation and add it to the DB
  this.donations = updatedDonation;
  this.save();
};

//remove selected items from checkout
userSchema.methods.removeFromCheckout = function (incomingProjectID) {
  index = this.donations.projects
    .map(function (projects) {
      console.log(projects._id);
      return projects._id;
    })
    .indexOf(incomingProjectID);

  this.donations.projects.splice(index, 1);
  this.save();
  console.log("Removed from checkout");
};

userSchema.methods.clearCheckout = function () {
  this.donations = {items: []};
  return this.save();
};

//Clear all the projects the user donated to after the donation transaction was sucessfull
userSchema.methods.clearDonationCart = function () {
  this.donations = {projects: []};
  console.log("All the projects was been removed from the cart!");
  return this.save();
};

function validateUser(user) {
  const schema = {
    username: Joi.string().min(4).max(15).required(),
    email: Joi.string().min(5).max(50).required().email(),
    password: Joi.string().min(8).max(100).required(),
  };
  return schema.validate(user);
}

const User = mongoose.model("user", userSchema);

module.exports = {User, validateUser};
//module.exports.User = User;
//module.exports.validateUser = validateUser;
//const {user, validateUser} = require("./")
