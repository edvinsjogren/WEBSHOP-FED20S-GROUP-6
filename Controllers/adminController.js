/*jshint esversion: 8 */

const Project = require("../Models/project");
const Image = require("../Models/image");

const renderAdminPage = async (req, res) => {

  const projects = await Project.find().populate("img");

  console.log(projects);

  res.render("admin.ejs", {projects: projects, img: projects.img});
};

const adminSubmit = async (req, res) => {
  const {title, description, summary, category, name} = req.body;

  const newImage = await new Image({
    name: name,
    path: req.file.filename,
  }).save();


  const project = await new Project({
    //Take the logged in admin user
    owner: req.user.user.username,
    category: category,
    title: title,
    description: description,
    summary: summary,
  }).save();

  project.addImage(newImage._id);

  res.redirect("/admin");
};

// delete project
const deleteProject = async (req, res) => {
  await Project.deleteOne({_id: req.params.id});

  res.redirect("/admin");
};

// Render the project that will be edited
const renderProjectForm = async (req, res) => {
  const projects = await Project.findOne({_id: req.params.id});
  res.render("adminEdit.ejs", {projects: projects});
};

// Submit project edits
const editProjectSubmit = async (req, res) => {
  const {title, description, summary, category, id} = req.body;

  await Project.updateOne(
    {_id: id},
    {
      owner: req.user.user.username,
      category: category,
      title: title,
      description: description,
      summary: summary,
    }
  );

  res.redirect("/admin");
};

module.exports = {
  renderAdminPage,
  adminSubmit,
  deleteProject,
  renderProjectForm,
  editProjectSubmit,
};
