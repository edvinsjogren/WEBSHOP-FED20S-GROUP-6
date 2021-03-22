const jwt = require("jsonwebtoken");
const { secretKey } = require("../Config/config")

let errors = [];

const verifyToken = (req, res, next) => {

  //reset the error message
  errors = [];

  const token = req.cookies.jsonWebToken;
  if (!token) 
  {

    errors.push("You are not logged in! To donate you have to have an account! Please log in and try again!")
    console.log("error");
    return res.render("landing.ejs", { errors: errors });
  
  }
  const validUser = jwt.verify(token, secretKey);
  if (validUser) {
    req.user = validUser;
  }
  next();
};

module.exports = verifyToken;