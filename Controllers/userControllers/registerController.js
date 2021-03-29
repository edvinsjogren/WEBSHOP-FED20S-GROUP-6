const {User, validateUser} = require("../../Models/user");
const bcrypt = require("bcrypt");

// Array to send custom error messages
let errors = [];

const renderRegisterPage = async (req, res) => {
  res.render("register.ejs", {errors: ""});
};

const submitNewAccount = async (req, res) => {
  //reset error-array
  errors = [];

  //validate received data from user by calling on function from userSchema
  const {error} = validateUser(req.body);

  if (error) {
    errors.push(error.details[0].message);
    //return res.send(error.details[0].message);
  }

  //get data from req.body
  const {username, email, password} = req.body;

  //handling error in case user don't type in anything
  if (!username) {
    errors.push(" Username is required!");
  }
  if (!email) {
    errors.push(" Email is required!");
  }
  if (!password) {
    errors.push(" Password is required!");
  }

  // Collect email in case the username or email is taken
  const checkEmail = await User.findOne({email: email});

  //This is check if there's a user with the same email, in case checkEmail doesn't find anything, it returns null
  if (checkEmail !== null) {
    // Check if the email, is taken, if they are, send error message
    if (email === checkEmail.email) {
      errors.push(" Email is taken! Please choose another one!");
    }
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
      return res.render("register.ejs", {errors: errors});
    }
  }
};

module.exports = {
  renderRegisterPage,
  submitNewAccount,
};
