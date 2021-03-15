const express = require("express");
const mongoose = require("mongoose");
const {database, databasePort} = require("./Config/config");

const app = express();
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({extended: false}));

const options = {useNewUrlParser: true, useUnifiedTopology: true};

mongoose.connect(database, options, (err) => {
  if (err) {
    console.log(err);
    return;
  }
  app.listen(databasePort || 8002, () => {
    console.log("app is running");
  });
});
