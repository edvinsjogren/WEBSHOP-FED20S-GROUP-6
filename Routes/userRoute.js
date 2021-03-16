const express = require("express");

const router = express.Router();

// Add controllers
const {renderRegisterPage, submitNewAccount} = require("../Controllers/userControllers/registerController")

//Register account
router.get("/register", renderRegisterPage);
router.post("/register", submitNewAccount);

module.exports = router;