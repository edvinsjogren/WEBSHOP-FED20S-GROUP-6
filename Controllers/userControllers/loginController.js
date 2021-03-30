/*jshint esversion: 8 */

const {User} = require("../../Models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {secretKey} = require("../../Config/config");

let errors = [];

const renderLoginPage = async (req, res) => {
  res.render("login.ejs", {errors: ""});
  //res.send("It works!")
};

const submitLogin = async (req, res) => {
  // Reset error messages
  errors = [];

  //collect from req.body
  const {email, password} = req.body;

  //error handling in case the user don't type in anything
  if (!email) {
    errors.push(" Please type in an email!");
  }
  if (!password) {
    errors.push(" Please type in a password!");
  }

  try {
    //Check if user is in DB
    const user = await User.findOne({email: email});

    // If the user don't exists
    if (!user && email !== "") {
      req.flash("error", "Account does not exists! Please create an account!");
      return res.redirect("/login");
    }

    //Compare password
    const validUser = await bcrypt.compare(password, user.password);

    //If the passwords don't match, give error message and redirect to login page
    if (!validUser) {
      req.flash("error", "Incorrect password! Please try again!");
      return res.redirect("/login");
    }

    //Create token
    const jsonWebToken = await jwt.sign({user: user}, secretKey);
    if (jsonWebToken) {
      //Get cookie
      const cookie = req.cookies.jsonWebToken;
      // if no cookie exists, create it with the token
      if (!cookie) {
        res.cookie("jsonWebToken", jsonWebToken, {
          maxAge: 360000000,
          httpOnly: true,
        });
      }
      console.log(validUser);
      return res.redirect("/");
    }

    return res.redirect("/login");
  } catch (err) {
    if (errors) {
      return res.render("login.ejs", {errors: errors});
    }
  }
};

module.exports = {
  renderLoginPage,
  submitLogin,
};
