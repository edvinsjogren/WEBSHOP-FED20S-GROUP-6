const jwt = require("jsonwebtoken");
const { secretKey } = require("../Config/config")

const verifyToken = (req, res, next) => {
  const token = req.cookies.jsonWebToken;
  if (!token) 
  {

    console.log("error");
  return res.render("landing.ejs", { err: "Login failed" });
  
  }
  const validUser = jwt.verify(token, secretKey);
  if (validUser) {
    req.user = validUser;
  }
  next();
};

module.exports = verifyToken;