const Project = require("../Models/project");
const User = require("../Models/user");

const renderAdminPage = async (req, res) => {
  const projects = await Project.find();
  console.log(projects);
  res.render("admin.ejs", {projects: projects});
};

const adminEdit = async (req, res) => {
  const {title, description} = req.body;

  const editedProject = await new Project({
    title: title,
    desription: description,
  }).save();

  //await Todo.deleteOne({_id: req.params.id});

  res.render("admin.ejs");
};



module.exports = {
  renderAdminPage,
  adminEdit,

};
