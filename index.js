const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({extended: false}));

mongoose.connect(process.env.DATABASE_URL, options, (err) => {
  if (err) {
    console.log(err);
    return;
  }
  app.listen(process.env.PORT || 8002, () => {
    console.log("app is running");
  });
});
