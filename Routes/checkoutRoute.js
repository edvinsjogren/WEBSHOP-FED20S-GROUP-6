const express = require("express");
const router = express.Router();
const verifyUser = require("../middleware/verifyUser");
const multer = require("multer");

const {checkoutRender} = require("../Controllers/checkoutController"); //dont forget to get paymentSubmit

//render projects on checkout page
router.get("/checkout", verifyUser, checkoutRender);

//let user delete donation from checkoutpage
//router.post("/delete/:id", verifyUser,  )

//let user edit donation amount in checkoutpage
//router.get("/editDonation/:id", editAmountDonation)

//finalize payment
//router.get("/payment", verifyUser, paymentSubmit)

module.exports = router;
