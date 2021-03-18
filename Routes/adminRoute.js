const express = require("express");
const router = express.Router();

const verifyAdmin = require("../Middleware/verifyAdmin");

const {
  renderAdminPage,
  adminSubmit,
  deleteProject,
} = require("../Controllers/adminController");

//render adminPage and let admin make changes
router.get("/admin", verifyAdmin, renderAdminPage);
router.post("/admin", adminSubmit);

//let admin delete items from admin site
//rounter.get("/admin", deleteProject);

module.exports = router;
