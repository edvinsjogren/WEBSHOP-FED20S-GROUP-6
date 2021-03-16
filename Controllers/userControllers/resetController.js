const User = require("../../Models/user");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

const {nodeMailerPassword, nodeMailerUser} = require("../../Config/config");

let errors = [];

const transport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: nodeMailerUser,
    pass: nodeMailerPassword,
  },
});

const renderResetPasswordPage = (req, res) => {
  res.render("resetForm.ejs", {err: ""});
};

const submitResetPasswordPage = async (req, res) => {
  const email = req.body.email;
  const user = await User.findOne({email: email});

  if (!user) {
    req.flash(
      "error",
      "Hey there, you either forgot to type in your email or the typed email has no registered account. Please try again!"
    );
    return res.redirect("/resetPassword");
  }

  const token = await crypto.randomBytes(32).toString("hex");
  user.token = token;
  user.tokenExpirationDate = Date.now() + 36000000;
  await user.save();

  await transport.sendMail({
    from: nodeMailerUser,
    to: user.email,
    subject: "Reset your password",
    html: `<h1>Hi ${user.name}!</h1>
      <p>You have requested a password reset. Click on the link below to create a new password:</p>
      <a href="http://localhost:8000/resetPassword/${user.token}"><button>Set a new password</button></a>`,
  });

  req.flash(
    "notify",
    "Check your email, you should now have received a link to reset your password."
  );
  res.render("resetForm.ejs");
};

const submitResetPasswordFormPage = async (req, res) => {
  //empty the array with errors
  errors = [];

  const {email, password} = req.body;

  //error control in case no password is typed before sumbitting
  if (!password) {
    errors.push("Please type in a new password, the field cannot be empty");
    res.render("reset.ejs", {errors, email});
  }

  const salt = await bcrypt.genSalt(12);
  const hashedPassword = await bcrypt.hash(password, salt);
  const user = await User.findOne({email: email});

  user.password = hashedPassword;
  await user.save();

  //Notify the user that the password is successfully changed through flash
  req.flash("notify", "Great, your password has now been changed!");
  res.redirect("/login");
};

const resetPasswordParams = async (req, res) => {
  const token = req.params.token;

  try {
    const user = await User.findOne({
      token: token,
      tokenExpirationDate: {$gt: Date.now()},
    });

    if (!user) {
      req.flash("error", "Whoopsie, something went wrong! Try again!");
      return res.redirect("/resetPassword");
    }

    res.render("reset.ejs", {errors, email: user.email});
  } catch (err) {
    res.render("resetForm.ejs", {err: ""});
  }
};

module.exports = {
  renderResetPasswordPage,
  submitResetPasswordPage,
  submitResetPasswordFormPage,
  resetPasswordParams,
};
