const Project = require("../Models/project");
const User = require("../Models/user");

const projectsRender = async (req, res) => {
  const user = await User.findOne({ _id: req.user.user._id });

  const page = +req.query.page || 1;

  //How many projects we have
  const amountOfProjects = await Project.find().countDocuments();

  //How many projects we show per page
  const showedProjectsPerPage = 2;

  //The total pages we have
  const totalPages = Math.ceil(amountOfProjects / showedProjectsPerPage);

  //Projects to show in total
  const projectsToShow = showedProjectsPerPage * page;

  const projects = await Project.find().populate("img").limit(projectsToShow);

  res.render("projects.ejs", {
    user: user,
    projects: projects,
    page,
    amountOfProjects,
    showedProjectsPerPage,
    totalPages,
    projectsToShow,
    img: projects.img,
  });
};

const projectsSubmit = async (req, res) => {
  const { donation, id, page} = req.body;
  const project = await Project.findOne({ _id: id });
  const user = await User.findOne({ _id: req.user.user._id });

  //Check if the user didn't type in an amount
  if (!donation) {
    req.flash(
      "error",
      "You haven't chosen an amount to donate! Please try again!"
    );
    return res.redirect("/projects/?page="+page) 
  }

  for (let i = 0; i < user.donations.projects.length; i++) {
    //Check if the user already have the donation
    if (user.donations.projects[i].projectID == id) {
      req.flash(
        "duplicate",
        "You've already donated to this project! Visit the checkout page to alter your donations!"
      );
      return res.redirect("/projects/?page="+page) 
    }
  }

  //Stripe won't allow more than 999,999.999 USD as an amount. This prevents the user from donatin that much
  if(donation >= 999999) {
    req.flash(
      "donationTooBig",
      "Attention! You cannot give away more than 999,999.00 US dollars. Please choose a lower amount or contact customer service!"
    );
    return res.redirect("/projects/?page="+page)
  }

  // use schema method to add project and donation data to user DB
  user.addDonation(project._id, donation);
  req.flash(
    "confirmation",
    "Donation successfully added to your list of donations, proceed to checkout to complete your donation!"
  );

  return res.redirect("/projects/?page="+page) 
};

const wishlistSubmit = async (req, res) => {
  const {wishId, page} = req.body;

  const project = await Project.findOne({ _id: wishId });
  const user = await User.findOne({ _id: req.user.user._id });

  const isInWishlist = user.wishlist.includes(project._id)
  
  const projectIdArray = user.donations.projects
  .map(function (project) {
  return project.projectID;
  })
  const isInDonations = projectIdArray.includes(project._id);

    // Check if specific objectID exists in user.wishlist (array)
  if (isInWishlist === true) {
    req.flash(
      "duplicateWish",
      "You already have this project under observation!"
    );
    return res.redirect("/projects/?page="+page) 

    // Check if specific objectID already exists in user.donations (array)
  } else if (isInDonations === true){
    req.flash(
      "duplicateWishDonation",
      "You've already registered a donation to this project!"
    );
    return res.redirect("/projects/?page="+page) 

    //if not, run schema method, adding it to user.wishlist
    } else {
    user.addToWishlist(project._id);
    
    req.flash(
      "addedWish", 
      "Project is now under your observation!"
    );
    return res.redirect("/projects/?page="+page) 
    }
  }

module.exports = {
  projectsRender,
  projectsSubmit,
  wishlistSubmit,
};
