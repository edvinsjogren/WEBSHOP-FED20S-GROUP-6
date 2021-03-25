const express = require("express");
const router = express.Router();
const verifyUser = require("../middleware/verifyUser");

const {
  checkoutRender,
  sucessfulDonation,
  renderDonationsMade
} = require("../Controllers/checkoutController"); //dont forget to get paymentSubmit

//render projects on checkout page
router.get("/checkout", verifyUser, checkoutRender);

//finalize payment
router.get("/sucessfulDonation", verifyUser, sucessfulDonation)
//Triggers a "receipt" page showing the projects the user donated to and how much they donated
router.get("/donationsMade", verifyUser, renderDonationsMade);

module.exports = router;
