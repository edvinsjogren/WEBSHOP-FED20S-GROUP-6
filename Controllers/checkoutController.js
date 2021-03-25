/*jshint esversion: 8 */

const Project = require("../Models/project");
const User = require("../Models/user");
const nodemailer = require("nodemailer")
const {stripeSecretKey, stripePublicKey, nodeMailerUser, nodeMailerPassword} = require("../Config/config");
const stripe = require("stripe")(stripeSecretKey); 

//render projects on checkout page
const checkoutRender = async (req, res) => {
  const projects = await Project.find().populate("img");
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

  

  //if cart is empty, redirect user to projects page
  if (!totalSumInCart) {
    req.flash(
      "notify",
      "Your cart is empty, but feel free too look around for potential lives to impact!"
    );
    return res.redirect("/projects");
  }

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

  await user
    .populate({
      path: "donations",
      populate: {
        path: "projects.projectID",
      },
    })
    .execPopulate();

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
    },
  })
  .execPopulate();

  let donationsInCart = user.donations.projects;
  console.log(donationsInCart);

  //map out the sum of all cart items
  const userCartItemPricessMap = donationsInCart.map(
    (item) => item.donationAmount
  );
  const reducer = (accumulator, currentValue) => accumulator + currentValue;
  //Total sum of the all the money that has been donated to the project 
  const totalSumInCart = userCartItemPricessMap.reduce(reducer, 0);

  res.render("donatedProjects.ejs", {
    user: user, 
    projects: user.donations.projects,
    totalSumInCart: totalSumInCart
  })

  //clears the donationCart after the user has seen the purchase
  user.clearDonationCart();

}

module.exports = {
  checkoutRender,
  sucessfulDonation,
  renderDonationsMade
};
