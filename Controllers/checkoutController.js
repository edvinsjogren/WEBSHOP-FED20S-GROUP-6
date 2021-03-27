/*jshint esversion: 8 */

const Project = require("../Models/project");
const User = require("../Models/user");
const nodemailer = require("nodemailer")
const {stripeSecretKey, stripePublicKey, nodeMailerUser, nodeMailerPassword} = require("../Config/config");
const stripe = require("stripe")(stripeSecretKey); 

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


  //save the list of projects added in donationsInCart
  let donationsInCart = user.donations.projects;

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


  //Check if the cart is empty
  if(!donationsInCart || donationsInCart.length === 0) {
    req.flash('emptyDonationCart', 'Your cart is empty! Please add a donation from a project first!')
    return res.redirect("/checkout")
  }

  // Create a stripe session
  const session = await stripe.checkout.sessions.create({

    success_url: 'http://localhost:8000/sucessfulDonation',
    cancel_url:  'https://localhost:8000/projects',
    payment_method_types: ['card'],
    line_items: donationsInCart.map( donation => {

        return {
            name: donation.projectID.title, 
            // The donationAmount was only in cents, *100 equals the price in dollars. So if the donationAmount is 10, the amount is 0.10*100 = 10 USD
            amount:  donation.donationAmount *100 , 
            quantity: 1, 
            currency: "usd"
        }

    }), 
    mode: 'payment',

  })

  console.log(session);


  //render the projects specific for the user, on checkout page
  res.render("checkout.ejs", {
    projects: projects,
    totalSumInCart: totalSumInCart,
    user: user,
    donationsInCart: donationsInCart,
    sessionId: session.id,
    stripePublicKey: stripePublicKey
  });
};


// Transport to initiate nodemailer
const transport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: nodeMailerUser,
    pass: nodeMailerPassword,
  },
});

//After the user paid an email is send to the user where you can see the donations that has been made
const sucessfulDonation = async (req,res) => {

  const user = await User.findOne({_id: req.user.user._id});
  
  //Send confirmation mail with a link, showing the donations and the projects the user made
  await transport.sendMail({
    from: nodeMailerUser,
    to: user.email,
    subject: "Your donation(s) has been made!",
    html: 
      `
        <h1>Thank you for your donation ${user.username}!</h1>
        <p>Thank you for your contribution to these projects!</p>
        <p>For more information regarding to the projects you have made, visit <a href="http://localhost:8000/donationsMade">this link</a></p>
        
        <p>OBS! The link only works one time!</p>

        <p>Best regards,</p>
        <p>The Other 99</p>

      `
  });

  res.render("payment.ejs");

}

//A "receipt" on the donations the user made. 
const renderDonationsMade = async (req,res) => {

  const user = await User.findOne({_id: req.user.user._id});

  await user
  .populate({
    path: "donations",
    populate: {
      path: "projects.projectID",
      populate: {
        path: "img",
        select: "path"
      }
    },
  })
  .execPopulate();

  let donationsInCart = user.donations.projects;

  //map out the sum of all cart items
  const userCartItemPricessMap = donationsInCart.map(
    (item) => item.donationAmount
  );
  const reducer = (accumulator, currentValue) => accumulator + currentValue;
  //Total sum of the all the money that has been donated to the project 
  const totalSumInCart = userCartItemPricessMap.reduce(reducer, 0);

  res.render("donatedProjects.ejs", {
    user: user, 
    donatedProjects: donationsInCart,
    totalSumInCart: totalSumInCart
  })

  //clears the donationCart after the user has seen the purchase
  user.clearDonationCart();

}

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
  sucessfulDonation,
  renderDonationsMade
};
