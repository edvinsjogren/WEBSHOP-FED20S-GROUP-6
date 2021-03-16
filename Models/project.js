const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  owner: { type: String },
  category: { type: String },
  title: { type: String },
  summary: { type: String },
  description: { type: String },
// donation: {type: Number, default: 0},
//   img: [
//     {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Image",
//     },
//   ],
});

projectSchema.methods.addImage = function (imgId) {
  this.img.push(imgId);
  this.save();
};

const Project = mongoose.model("Project", projectSchema);

module.exports = Project;
