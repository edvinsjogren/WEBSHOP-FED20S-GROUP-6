const express = require("express");
const router = express.Router();
const verifyUser = require("../middleware/verifyUser");

const {
  projectsRender,
  projectsSubmit,
  wishlistSubmit,
} = require("../Controllers/projectsController");

router.get("/projects", verifyUser, projectsRender);

//Submit a donation
router.post("/projects", verifyUser, projectsSubmit);

//Adding project to whishlist
router.post("/projects/wishlist", verifyUser, wishlistSubmit)

module.exports = router;