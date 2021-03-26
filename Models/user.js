const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
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
        donationAmount: { type: Number },
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
  const index = this.donations.projects
    .map(function (projects) {
      return projects._id;
    })
    .indexOf(incomingProjectID);

  this.donations.projects.splice(index, 1);

  this.save();
  //console.log("Removed from checkout");
};

userSchema.methods.clearCheckout = function () {
  this.donations.projects = [];
  return this.save();
};

userSchema.methods.editDonation = function (
  incomingProjectID,
  incomingDonationAmount
) {
  // find the specific project of which to update value
  const selectedDonation = this.donations.projects.find(
    (project) => project._id == incomingProjectID
  );

  // update the project with incoming value
  selectedDonation.donationAmount = incomingDonationAmount;

  this.save();
};

const User = mongoose.model("user", userSchema);

module.exports = User;
