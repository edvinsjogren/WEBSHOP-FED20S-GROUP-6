const express = require("express");
const router = express.Router();
const verifyUser = require("../middleware/verifyUser");

const {
  profileRender,
  profileSubmit,
  removeSubmit,
} = require("../Controllers/profileController");

router.get("/profile", verifyUser, profileRender);

router.post("/profile", verifyUser, profileSubmit);
router.post("/profile/delete", verifyUser, removeSubmit)


module.exports = router;