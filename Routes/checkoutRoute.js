const express = require("express");
const router = express.Router();
const verifyUser = require("../middleware/verifyUser");

const {checkoutRender} = require("../Controllers/checkoutController");
//dont forget to get paymentSubmit

//render projects on checkout page
router.get("/checkout", verifyUser, checkoutRender);

//checkout and pay
//router.get("/payment", verifyUser, paymentSubmit)

module.exports = router;
