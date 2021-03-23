const express = require("express");
const mongoose = require("mongoose");
const {database, databasePort, flashKey} = require("./Config/config");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");

const flash = require("express-flash");
const session = require("express-session");
const path = require("path");

const userRoute = require("./Routes/userRoute");
const adminRoute = require("./Routes/adminRoute");
const projectsRoute = require("./Routes/projectsRoute");

const app = express();

app.use("/Public", express.static(path.join(__dirname, "Public")));

app.set("view engine", "ejs");

// Used to find paths to all ejs-files in view-folder
app.set("views", [
  path.join(__dirname, "views"),
  path.join(__dirname, "views/user"),
  path.join(__dirname, "views/layout"),
]);

app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use(bodyParser.urlencoded({extended: false}));

//Use for express-flash/express-session
app.use(
  session({
    secret: flashKey,
    saveUninitialized: true,
    resave: false,
  })
);
app.use(flash());
app.use(cookieParser());

app.use(userRoute);
app.use(adminRoute);
app.use(projectsRoute);

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
};

mongoose.connect(database, options, (err) => {
  if (err) {
    console.log(err);
    return;
  }
  app.listen(databasePort || 8002, () => {
    console.log("app is running");
  });
});
