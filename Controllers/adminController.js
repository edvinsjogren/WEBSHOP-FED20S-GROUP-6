const Project = require("../Models/project");
const User = require("../Models/user");

const renderAdminPage = async (req, res) => {
  const projects = await Project.find();

  res.render("admin.ejs", {projects: projects});
};

const adminSubmit = async (req, res) => {
  const {title, description, summary, category} = req.body;
  const project = await Project.findOne({_id: id});
  const user = await User.findOne({_id: req.user.user._id});

  const editedProject = await new Project({
    title: title,
    desription: description,
    summary: summary,
    category: category,
  }).save();

  res.redirect("/admin");
};

module.exports = {
  renderAdminPage,
  adminSubmit,
};
