const express = require("express");

const router = express.Router();

// Add controllers
const {renderRegisterPage, submitNewAccount} = require("../Controllers/userControllers/registerController")
const {renderLoginPage, submitLogin} = require("../Controllers/userControllers/loginController")

//Register account
router.get("/register", renderRegisterPage);
router.post("/register", submitNewAccount);

//Login
router.get("/login", renderLoginPage);
router.post("/login", submitLogin);

module.exports = router;