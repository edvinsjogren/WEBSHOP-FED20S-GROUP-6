const {User, validateUser} = require("../../Models/user");
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
      "noEmail",
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
    html: `<h1>Hi ${user.username}!</h1>
      <p>You have requested a password reset. Click on the link below to create a new password:</p>
      <a href="http://localhost:8000/resetPassword/${user.token}"><button>Set a new password</button></a>`,
  });

  req.flash(
    "emailNotification",
    "Check your email, you should now have received a link to reset your password."
  );
  res.render("resetForm.ejs", {user: user});
};

const submitResetPasswordFormPage = async (req, res) => {
  //empty the array with errors
  errors = [];

  const {email, password, username} = req.body;

  //Check validaion from JOI
  const {error} = validateUser(req.body);

  if(error) {
    return res.render("reset.ejs", {email, username, error: error.details, errors: errors});
  }

  const salt = await bcrypt.genSalt(12);
  const hashedPassword = await bcrypt.hash(password, salt);
  const user = await User.findOne({email: email});

  user.password = hashedPassword;
  await user.save();

  //Notify the user that the password is successfully changed through flash
  req.flash("passwordChanged", "Great, your password has now been changed!");
  return res.redirect("/login");
};

//get the params from the form in resetForm.ejs and control if the user exists
const resetPasswordParams = async (req, res) => {
  const token = req.params.token;

  try {
    const user = await User.findOne({
      token: token,
      tokenExpirationDate: {$gt: Date.now()},
    });

    res.render("reset.ejs", {errors: errors, email: user.email, username: user.username, error:""});
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
