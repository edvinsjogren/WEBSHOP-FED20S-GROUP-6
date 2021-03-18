const jwt = require("jsonwebtoken");
const {secretKey} = require("../Config/config");

const verifyAdmin = (req, res, next) => {
  const token = req.cookies.jwtToken;
  if (!token) return res.render("admin.ejs", {err: "Login failed"});

  const validUser = jwt.verify(token, secretKey);
  if (validUser) {
    req.user = validUser;
  }

  next();
};

module.exports = verifyAdmin;
