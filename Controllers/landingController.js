const {User} = require("../Models/user");
let errors = [];

const landingRender = async (req, res) => {
  errors = [];
  const user = await User.findOne({ _id: req.user.user._id });

  console.log(user);

  res.render("landing.ejs", { user: user, errors: errors });
};

module.exports = { landingRender };
