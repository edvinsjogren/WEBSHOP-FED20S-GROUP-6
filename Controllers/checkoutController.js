/*jshint esversion: 8 */

const Project = require("../Models/project");
const User = require("../Models/user");

//render projects on checkout page/in shoppingcart
const checkoutRender = async (req, res) => {
  const projects = await Project.find().populate("img");

  const user = await User.findOne({ _id: req.user.user._id });

  //populate the user with the added projects specific for that user
  await user
    .populate({
      path: "donations",
      populate: {
        path: "projects.projectID",
        populate: {
          path: "img",
          select: "path",
        },
      },
    })
    .execPopulate();

  //save the list of projects specific for the user, in donationsInCart
  const donationsInCart = user.donations.projects;
  //console.log(donationsInCart);

  //map out/loop through and calculate sum of all cart items, in totalSumInCart
  const userCartItemPricesMap = donationsInCart.map(
    (item) => item.donationAmount
  );
  const reducer = (accumulator, currentValue) => accumulator + currentValue;
  const totalSumInCart = userCartItemPricesMap.reduce(reducer, 0);

  //if cart is empty, redirect user to projects page
  if (!totalSumInCart) {
    req.flash(
      "notify",
      "Your cart is empty, but feel free too look around for potential lives to impact!"
    );
    return res.redirect("/projects");
  }
  //console.log(donationsInCart);

  //render the projects specific for the user, on checkout page
  res.render("checkout.ejs", {
    projects: projects,
    totalSumInCart: totalSumInCart,
    user: user,
    donationsInCart: donationsInCart,
  });
};

//create request to delete a specific donation in the cart
const deleteSubmit = async (req, res) => {
  const user = await User.findOne({ _id: req.user.user._id });
  const idToRemove = req.body.id;
  user.removeFromCheckout(idToRemove);
  res.redirect("/checkout");
};

//render the projects that are to be edited on new route
const editRender = async (req, res) => {
  const user = await User.findOne({ _id: req.user.user._id });

  //populate the user with the added projects specific for that user
  await user
    .populate({
      path: "donations",
      populate: {
        path: "projects.projectID",
        populate: {
          path: "img",
          select: "path",
        },
      },
    })
    .execPopulate();

  // find the specific project to render, based on req.params
  const selectedDonation = user.donations.projects.find(
    (project) => project._id == req.params.id
  );

  res.render("checkoutEdit.ejs", { project: selectedDonation });
};

//post the edited amount on the checkout page
const editSubmit = async (req, res) => {
  const user = await User.findOne({ _id: req.user.user._id });
  const { donationAmount, id } = req.body;

  if (!donationAmount) {
    req.flash(
      "error",
      "You haven't chosen an amount to donate! Please try again!"
    );
    return res.redirect("/checkout")
  }

  //await User.updateOne({_id: id}, {donationAmount: donationAmount});
  user.editDonation(id, donationAmount)
  req.flash(
    "success",
    "You've updated your donation, time to seal the deal!"
  );
  res.redirect("/checkout");
};

module.exports = {
  checkoutRender,
  deleteSubmit,
  editRender,
  editSubmit,
};
