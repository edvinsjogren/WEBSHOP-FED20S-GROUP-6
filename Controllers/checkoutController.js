const Project = require("../Models/project");
const User = require("../Models/user");

const checkoutRender = async (req, res) => {
  const projects = await Project.find();

  res.render("checkout.ejs", {projects: projects});
};


module.exports = {
  checkoutRender,
};
