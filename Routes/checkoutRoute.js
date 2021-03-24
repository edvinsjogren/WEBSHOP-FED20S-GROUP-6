const express = require("express");
const router = express.Router();
const verifyUser = require("../middleware/verifyUser");

const {
  checkoutRender,
  sucessfulDonation
} = require("../Controllers/checkoutController"); //dont forget to get paymentSubmit

//render projects on checkout page
router.get("/checkout", verifyUser, checkoutRender);

//finalize payment
//router.get("/payment", verifyUser, paymentSubmit)

router.get("/sucessfulDonation", verifyUser, sucessfulDonation)

module.exports = router;
