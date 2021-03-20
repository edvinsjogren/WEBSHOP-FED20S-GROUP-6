const Project = require("../Models/project");
const User = require("../Models/user");

//render projects on checkout page
const checkoutRender = async (req, res) => {
  const projects = await Project.find();
  const user = await User.findOne({_id: req.user.user._id}).populate(
    "donationAmount"
  );

  //save the list of projects added in userCartItems
  let userCartItems = user.donations.projects;

  //map out the sum of all cart items
  const userCartItemPricessMap = userCartItems.map(
    (item) => item.donationAmount
  );
  const reducer = (accumulator, currentValue) => accumulator + currentValue;
  const totalSumInCart = userCartItemPricessMap.reduce(reducer);

  res.render("checkout.ejs", {
    projects: projects,
    totalSumInCart: totalSumInCart,
  });
};

// const paymentSubmit = async (req, res) => {
//find the projects that the user wants to pay for
//const user = await User.findOne({_id: req.user.user._id}).populate("donationAmount")

//create a stripe session

//  res.render("payment.ejs");
// };

module.exports = {
  checkoutRender,
};
//dont forget to send "paymentSubmit"
