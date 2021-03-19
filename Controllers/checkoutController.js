const Project = require("../Models/project");
const User = require("../Models/user");

//render projects on checkout page
const checkoutRender = async (req, res) => {
  const projects = await Project.find();
  res.render("checkout.ejs", {projects: projects});
};

const calculateProjectsSubmit = async (req, res) => {
  const user = await await User.findOne({_id: req.user.user._id}).populate(
    "donationAmount"
  );

  //save the list donations added in userCartItems
  const userCartItems = user.donations.projects;
  let totalNumberProjectsInCart = userCartItems.length;

  let totalCost = 0;

  for (let i = 0; i < userCartItems.length; i++) {
    let CostProjectsInCart = userCartItems[i].donationAmount;
    totalCost += CostProjectsInCart;
    console.log(totalCost);
  }
};

module.exports = {
  checkoutRender,
};
