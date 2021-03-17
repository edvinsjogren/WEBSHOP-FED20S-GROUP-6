const jwt = require("jsonwebtoken");
require("dotenv").config();

const verifyAdmin = (req, res, next) => {
  const token = req.cookies.jwtToken;
  if (!token) return res.render("admin.ejs", {err: "Login failed"});

  const validUser = jwt.verify(token, secretKey);

//   if (!validUser.user.)
//     return res.render("admin.ejs", {
//       err: "you don't have authorization to log in",
//     });
//   req.user = validUser;
//   next();
};

module.exports = verifyAdmin;
