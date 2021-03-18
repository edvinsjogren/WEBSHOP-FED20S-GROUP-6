const jwt = require("jsonwebtoken");
const {secretKey} = require("../Config/config");

const verifyAdmin = (req, res, next) => {
  const token = req.cookies.jwtToken;
  if (!token) return res.render("landing.ejs", {err: "login failed"});

  const validUser = jwt.verify(token, secretKey);
  if (!validUser.user.role)
    return res.render("landing.ejs", {err: "not valid user"});
  req.user = validUser;
  next();
};

module.exports = verifyAdmin;
