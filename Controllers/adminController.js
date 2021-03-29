/*jshint esversion: 8 */
const Project = require("../Models/project");
const Image = require("../Models/image");
const User = require("../Models/user");

//Array for custom-made error messages
let errors = [];

const renderAdminPage = async (req, res) => {

   errors = [];

  // Render all projects while populating img ID
  const projects = await Project.find().populate("img");
  const user = await User.findOne({_id: req.user.user._id});

  res.render("admin.ejs", {
    projects: projects,
    img: projects.img,
    errors: errors,
    user: user,
  });
};

const adminSubmit = async (req, res) => {
  const user = await User.findOne({_id: req.user.user._id});

  //reset error-message array
  errors = [];

  const {title, description, summary, category, picName, image} = req.body;

  //error handling in case the user hasn't typed in anything
  if (!title) {
    errors.push(" You forgot to choose a title! Please try again!");
  }
  if (!description) {
    errors.push(" You forgot to choose a description! Please try again!");
  }
  if (!summary) {
    errors.push(" You forgot to choose a summary! Please try again!");
  }
  if (!category) {
    errors.push(" You forgot to choose a category! Please try again!");
  }
  if (!picName) {
    errors.push(" You forgot a name for your picture! Please try again!");
  }
  if (!image) {
    errors.push(" You forgot to choose a picture in PNG-format! Please try again!");
  }

  try {
    // Get image data from admin form and save new image to DB
    const newImage = await new Image({
      name: picName,
      path: req.file.filename,
    }).save();

    //Get project data from admin form and save new project to DB
    const project = await new Project({
      //Take the logged in admin user
      owner: req.user.user.username,
      category: category,
      title: title,
      description: description,
      summary: summary,
    }).save();

    // use schema method to add image to the new project
    project.addImage(newImage._id);

    return res.redirect("/admin");
  } catch (err) {
    if (errors) {
      const projects = await Project.find().populate("img");
      return res.render("admin.ejs", {
        projects: projects,
        img: projects.img,
        errors: errors,
        user: user,
      });
    }
  }
};

// delete project
const deleteProject = async (req, res) => {
  await Project.deleteOne({_id: req.params.id});

  res.redirect("/admin");
};

// Render the project that will be edited
const renderProjectForm = async (req, res) => {

  const projects = await Project.findOne({ _id: req.params.id }).populate("img");

  res.render("adminEdit.ejs", { projects: projects, errors: errors });

};

// Submit project edits
const editProjectSubmit = async (req, res) => {
  //reset error-message array
  errors = [];

  const { title, description, summary, category, id, picName, image, imageID } = req.body;

  //error handling in case the user hasn't typed iu anything
  if (!title) {
    errors.push(" You forgot to choose a title! Please try again!");
  }
  if (!description) {
    errors.push(" You forgot to choose a description! Please try again!");
  }
  if (!summary) {
    errors.push(" You forgot to choose a summary! Please try again!");
  }
  if (!category) {
    errors.push(" You forgot to choose a category! Please try again!");
  }
  if(!image) {
    errors.push(" You forgot to choose a picture in PNG-format! Please try again!");
  }
  if(!picName) {
    errors.push(" You forgot a name for your picture! Please try again!");
  }
  //Redirect back to adminEdit.ejs in case the user hasn't put in the info required
  if (!title || !description || !summary || !category || !req.file.filename || !picName) {
    return res.redirect("/edit/" + id);
  }

  //Updating image
  await Image.updateOne(
    {_id: imageID},
    {
      name: picName,
      path: req.file.filename,
    }
  );

  // update project with new data
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

  return res.redirect("/admin");
};

module.exports = {
  renderAdminPage,
  adminSubmit,
  deleteProject,
  renderProjectForm,
  editProjectSubmit,
};
