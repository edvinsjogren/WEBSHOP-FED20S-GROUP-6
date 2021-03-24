/*jshint esversion: 8 */

const Project = require("../Models/project");
const User = require("../Models/user");
const Image = require("../Models/image");

//render projects on checkout page
const checkoutRender = async (req, res) => {
  const projects = await Project.find();
  const user = await User.findOne({_id: req.user.user._id});
  await user
    .populate({
      path: "donations",
      populate: {
        path: "projects.projectID",
      },
    })
    .execPopulate();

  //save the list of projects added in donationsInCart
  let donationsInCart = user.donations.projects;
  console.log(donationsInCart);

  //map out the sum of all cart items
  const userCartItemPricessMap = donationsInCart.map(
    (item) => item.donationAmount
  );
  const reducer = (accumulator, currentValue) => accumulator + currentValue;
  const totalSumInCart = userCartItemPricessMap.reduce(reducer, 0);
  //console.log(totalSumInCart);

  //if cart is empty, redirect user to projects page
  if (!totalSumInCart) {
    req.flash(
      "notify",
      "Your cart is empty, but feel free too look around for potential lives to impact!"
    );
    return res.redirect("/projects");
  }

  res.render("checkout.ejs", {
    projects: projects,
    totalSumInCart: totalSumInCart,
    user: user,
    donationsInCart: donationsInCart,
  });
};

// const editAmountDonation = async (req, res) => {
//   const {donationAmount} = req.body;
//   await User.update({_id: id}, {donationAmount: donationAmount});
//   res.redirect("/checkout");
// };


module.exports = {
  checkoutRender,
}; //dont forget to send "paymentSubmit"
