/*jshint esversion: 8 */

const Project = require("../Models/project");
const User = require("../Models/user");
const Image = require("../Models/image");

//render projects on checkout page/in shoppingcart
const checkoutRender = async (req, res) => {
  const projects = await Project.find();
  const user = await User.findOne({_id: req.user.user._id});

  //populate the user with the added projects specific for that user
  await user
    .populate({
      path: "donations",
      populate: {
        path: "projects.projectID",
      },
    })
    .execPopulate();

  //save the list of projects specific for the user, in donationsInCart
  const donationsInCart = user.donations.projects;

  //map out/loop through and calculate sum of all cart items, in totalSumInCart
  const userCartItemPricessMap = donationsInCart.map(
    (item) => item.donationAmount
  );
  const reducer = (accumulator, currentValue) => accumulator + currentValue;
  const totalSumInCart = userCartItemPricessMap.reduce(reducer, 0);

  //if cart is empty, redirect user to projects page
  if (!totalSumInCart) {
    req.flash(
      "notify",
      "Your cart is empty, but feel free too look around for potential lives to impact!"
    );
    return res.redirect("/projects");
  }

  //render the projects specific for the user, on checkout page
  res.render("checkout.ejs", {
    projects: projects,
    totalSumInCart: totalSumInCart,
    user: user,
    donationsInCart: donationsInCart,
  });
};

//create request to delete a specific donation in the cart
const deleteFromCheckout = async (req, res) => {
  const user = await User.findOne({_id: req.user.user._id});
  const chosenProjectId = req.body.id;
  user.removeFromCheckout(chosenProjectId);
  res.redirect("/checkout");
};

//render the projects that are to be edited on new route
const editRender = async (req, res) => {
  const projects = await Project.find();
  const user = await User.findOne({_id: req.user.user._id});

  //populate the user with the added projects specific for that user
  await user
    .populate({
      path: "donations",
      populate: {
        path: "projects.projectID",
      },
    })
    .execPopulate();

  //save the list of projects specific for the user, in donationsInCart
  const donationsInCart = user.donations.projects;
  console.log(donationsInCart);

  //render the edit page 
  res.render("checkoutEdit.ejs", {
    projects: projects,
    user: user,
    donationsInCart: donationsInCart,
  });
};

//post the edited amount on the checkout page
const editedAmountDonation = async (req, res) => {
  const {donationAmount} = req.body;

  res.redirect("/checkout");
};

module.exports = {
  checkoutRender,
  deleteFromCheckout,
  editRender,
  editedAmountDonation,
};
