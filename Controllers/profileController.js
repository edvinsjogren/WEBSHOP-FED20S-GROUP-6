const Project = require("../Models/project");
const {User} = require("../Models/user");

const profileRender = async (req, res) => {
  const user = await User.findOne({ _id: req.user.user._id })
    .populate("wishlist")
    .populate({path: "wishlist", populate: {path: "img"}});

  res.render("profile.ejs", { user: user});
};

const profileSubmit = async (req, res) => {
    const { donation, id } = req.body;
    const project = await Project.findOne({ _id: id });
    const user = await User.findOne({ _id: req.user.user._id });
  
    //Check if the user didn't type in an amount
    if (!donation) {
      req.flash(
        "selectAmount",
        "You haven't chosen an amount to donate! Please try again!"
      );
      return res.redirect("/profile");
    }
  
    for (let i = 0; i < user.donations.projects.length; i++) {
      //Check if the user already have the donation
      if (user.donations.projects[i].projectID == id) {
        req.flash(
          "duplicateDonation",
          "You've already donated to this project! Visit the checkout page to alter your donations!"
        );
        return res.redirect("/profile");
      }
    }
  
     //Stripe won't allow more than 999,999.999 USD as an amount. This prevents the user from donatin that much
    if(donation >= 999999) {
      req.flash(
        "donationTooBig",
        "Attention! You cannot give away more than 999,999.00 US dollars. Please choose a lower amount or contact customer service!"
      );
      return res.redirect("/profile")
    }

    // use schema method to att project and donation data to user DB
    user.addDonation(project._id, donation);
    
    req.flash(
      "donationSuccess",
      "Donation successfully added to your list of donations, proceed to checkout to complete your donation!"
    );
  
    return res.redirect("/profile");
  };

  const removeSubmit = async (req, res) => {
      const removeId = req.body.removeId;
      const user = await User.findOne({ _id: req.user.user._id });

      await user.removeFromWishlist(removeId)
      res.redirect("/profile")
  }

module.exports = {
  profileRender,
  profileSubmit,
  removeSubmit,
};
