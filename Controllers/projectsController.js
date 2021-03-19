const Project = require("../Models/project");
const User = require("../Models/user");

const projectsRender = async (req, res) => {

  const page = req.query.page || 1;

  //How many projects we have
  const amountOfProjects = await Project.find().countDocuments();

  //How many projects we show per page
  const showedProjectsPerPage = 2;

  //The total pages we have
  const totalPages = Math.ceil(amountOfProjects/showedProjectsPerPage);

  //Projects to show in total
  const projectsToShow = showedProjectsPerPage*page;

  const projects = await Project.find().limit(projectsToShow);

  res.render("projects.ejs", 
  { 
    projects: projects,
    page,
    amountOfProjects,
    showedProjectsPerPage,
    totalPages,
    projectsToShow,

  }
  );
};

const projectsSubmit = async (req, res) => {
  const { donation, id } = req.body;
  const project = await Project.findOne({ _id: id });
  const user = await User.findOne({ _id: req.user.user._id });

  //Check if the user didn't type in an amount 
  if(!donation) {
    req.flash("error", "You haven't chosen an amount to donate! Please try again!");
    return res.redirect("/projects")
  }

  for(let i=0; i<user.donations.projects.length; i++) {
    //Check if the user already have the donation
    if(user.donations.projects[i].projectID == id) {
      
      req.flash("duplicate", "You've already donated to this project! Visit the checkout page to alter your donations!");
      return res.redirect("/projects");

    }

  }
  
  user.addDonation(project._id, donation);
  req.flash("confirmation", "Donation successfully added to your list of donations, proceed to checkout to complete your donation!");

  return res.redirect("/projects");

};

module.exports = {
  projectsRender,
  projectsSubmit,
};
