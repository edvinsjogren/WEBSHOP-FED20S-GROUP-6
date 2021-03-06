const {User, validateUser} = require("../../Models/user");
const bcrypt = require("bcrypt");

// Array to send custom error messages
let errors = [];

const renderRegisterPage = async (req, res) => {
  res.render("register.ejs", {errors: "", error: ""});
};

const submitNewAccount = async (req, res) => {
  //reset error-array
  errors = [];

  //get data from req.body
  const {username, email, password} = req.body;

  // Collect email in case the username or email is taken
  const checkEmail = await User.findOne({email: email});

  //This is check if there's a user with the same email, in case checkEmail doesn't find anything, it returns null
  if (checkEmail !== null) {
    // Check if the email, is taken, if they are, send error message
    if (email === checkEmail.email) {
      errors.push(" Email is taken! Please choose another one!");
    }
  }

  //JOI: if user does not fulfill validation requirements, place the errors in a variable
  const { error } = validateUser(req.body);

  //then present the error message to the user
  if (error) {
    console.log(error.details);
    return res.render("register.ejs", {error: error.details, errors: ""});
  }

  try {
    // Hash the password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    //Save in DB
    await new User({
      username: username,
      email: email,
      password: hashedPassword,
    }).save();

    req.flash("notify", "Account sucessfully created!");
    return res.redirect("/login");
  } catch (err) {
    if (errors) {
      return res.render("register.ejs", { errors: errors, error: "" });
    }
  }
};

module.exports = {
  renderRegisterPage,
  submitNewAccount,
};