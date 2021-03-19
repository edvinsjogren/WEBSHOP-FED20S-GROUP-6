const Project = require("../Models/project");
const User = require("../Models/user");

//render projects on checkout page
const checkoutRender = async (req, res) => {
  const projects = await Project.find();
  //const user = await User.findOne({_id: req.user.user._id});
  //console.log(user);
  res.render("checkout.ejs", {projects: projects});
};

// const calculateProjectsSubmit = async (req, res) =>{
// const user = await User.findOne({_id: req.user.user._id});
//the donation amount from DB
//user.donations.projects[i].donationAmount
// }

module.exports = {
  checkoutRender,
};
