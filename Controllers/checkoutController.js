/*jshint esversion: 8 */

const Project = require("../Models/project");
const User = require("../Models/user");
const nodemailer = require("nodemailer")
const {stripeSecretKey, stripePublicKey, nodeMailerUser, nodeMailerPassword} = require("../Config/config");
const stripe = require("stripe")(stripeSecretKey); 

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
  console.log(user.donations.projects[0].projectID.title);

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

   //save the list of projects added in donationsInCart
   let donationsInCart = user.donations.projects;
   console.log(donationsInCart);
 
   //map out the sum of all cart items
   const userCartItemPricessMap = donationsInCart.map(
     (item) => item.donationAmount
   );
   const reducer = (accumulator, currentValue) => accumulator + currentValue;
   const totalSumInCart = userCartItemPricessMap.reduce(reducer, 0);

  await user
    .populate({
      path: "donations",
      populate: {
        path: "projects.projectID",
      },
    })
    .execPopulate();


  //Work in progress, NOT DONE!!!
  await transport.sendMail({
    from: nodeMailerUser,
    to: user.email,
    subject: "Your donation(s) has been made!",
    html: 
    
      `
        <h1>Thank you for your donation ${user.username}!</h1>
        
        <p></p>
      
      <p>Total amount: ${totalSumInCart} USD</p>  
      `
    
  });

  res.render("payment.ejs");

  //clears the donationCart
  user.clearDonationCart();
}

module.exports = {
  checkoutRender,
  sucessfulDonation
};
