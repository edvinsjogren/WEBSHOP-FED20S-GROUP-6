const express = require("express");
const router = express.Router();

// Add controllers
const {
  renderRegisterPage,
  submitNewAccount,
} = require("../Controllers/userControllers/registerController");
const {
  renderLoginPage,
  submitLogin,
} = require("../Controllers/userControllers/loginController");
const {
  renderResetPasswordPage,
  submitResetPasswordPage,
} = require("../Controllers/userControllers/resetController");
const {
  submitResetPasswordFormPage,
  resetPasswordParams,
} = require("../Controllers/userControllers/resetController");

//Register account
router.get("/register", renderRegisterPage);
router.post("/register", submitNewAccount);

//Login
router.get("/login", renderLoginPage);
router.post("/login", submitLogin);

//Render the reset password page and then recievce users email to send then reset link
router.get("/resetPassword", renderResetPasswordPage);
router.post("/resetPassword", submitResetPasswordPage);

//Rendering reset password form page and recieving the new password saving it in the DB
router.get("/resetPassword/:token", resetPasswordParams);
router.post("/resetPasswordForm", submitResetPasswordFormPage);

module.exports = router;
