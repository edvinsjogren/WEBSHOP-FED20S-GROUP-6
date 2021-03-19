const express = require("express");
const router = express.Router();
const verifyUser = require("../middleware/verifyUser");

const {checkoutRender} = require("../Controllers/checkoutController");

//render projects on checkout page
router.get("/checkout", checkoutRender);

module.exports = router;
