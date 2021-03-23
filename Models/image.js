const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  path: { type: String, required: true },
});

const Image = mongoose.model("Image", imageSchema);

module.exports = Image;
