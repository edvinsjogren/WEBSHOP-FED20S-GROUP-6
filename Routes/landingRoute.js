const express = require("express");
const router = express.Router();
const verifyUser = require("../middleware/verifyUser");

const {
  landingRender,
} = require("../Controllers/landingController");

router.get("/", verifyUser, landingRender);


module.exports = router;