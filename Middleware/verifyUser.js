const jwt = require("jsonwebtoken");
const { secretKey } = require("../Config/config");
const Project = require("../Models/project");

let errors = [];

const verifyToken = async (req, res, next) => {
  //reset the error message
  errors = [];
  const url = req.originalUrl;

  //pagination variables (see projectsRender)
  const page = req.query.page || 1;
  const amountOfProjects = await Project.find().countDocuments();
  const showedProjectsPerPage = 2;
  const totalPages = Math.ceil(amountOfProjects / showedProjectsPerPage);
  const projectsToShow = showedProjectsPerPage * page;
  const projects = await Project.find().populate("img").limit(projectsToShow);

  const token = req.cookies.jsonWebToken;
  if (!token) {
    errors.push(
      "You are not logged in! To donate you have to register and/or log in to an account!"
    );

    // unverified user visiting /projects (including pagination variables) 
    if (url.includes("/projects")) {
      return res.render("projects.ejs", { 
        errors: errors,
        user: null,
        projects: projects,
        page,
        amountOfProjects,
        showedProjectsPerPage,
        totalPages,
        projectsToShow,
        img: projects.img, });
    } else {
      return res.render("landing.ejs", { user: null, errors: errors });
    }
  }
  const validUser = jwt.verify(token, secretKey);
  if (validUser) {
    req.user = validUser;
  }
  next();
};

module.exports = verifyToken;