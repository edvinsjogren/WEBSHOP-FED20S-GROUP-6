const express = require("express");
const router = express.Router();
const verifyUser = require("../middleware/verifyUser");
const multer = require("multer");

const {
  checkoutRender,
  deleteFromCheckout,
  editRender,
  editedAmountDonation,
} = require("../Controllers/checkoutController");
//render projects on checkout page
router.get("/checkout", verifyUser, checkoutRender);

//let user delete donation from checkoutpage
router.post("/deleteDonation/:id", verifyUser, deleteFromCheckout);

//direct the user to a form where they can edit the donation amount in checkoutpage
router.get("/editDonation/:id", verifyUser, editRender);
router.post("/editDonation", verifyUser, editedAmountDonation);

module.exports = router;
