const express = require("express");
const router = express.Router();

const verifyAdmin = require("../Middleware/verifyAdmin");

const {
  renderAdminPage,
  adminSubmit,
} = require("../Controllers/adminController");

//render adminPage and let admin make changes
router.get("/admin", verifyAdmin, renderAdminPage);
router.post("/admin", adminSubmit);

module.exports = router;
