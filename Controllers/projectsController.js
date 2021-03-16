const Project = require("../Models/project");
const User = require("../Models/user");

const projectsRender = async (req, res) => {
  const projects = await Project.find();

  res.render("projects.ejs", { projects: projects });
};

const projectsSubmit = async (req, res) => {
  const { donation, id } = req.body;
  const project = await Project.findOne({ _id: id });
  const user = await User.findOne({ _id: req.user.user._id });

  user.donations.forEach((donationId) => {
    if (donationId == id) {
      req.flash(
        "duplicate",
        "You've already donated to this project! Visit the checkout page to alter your donations."
      );
      console.log("Exists");
      
      return res.redirect("/projects");
    }

    user.addDonation(project._id);
    req.flash(
      "confirmation",
      "Donation successfully added to your list of donations, proceed to checkout to complete your donation!"
    );

    return res.redirect("/projects");
     
    });

};
module.exports = {
  projectsRender,
  projectsSubmit,
};
