const express = require("express");
const router = express.Router();

const verifyAdmin = require("../Middleware/verifyAdmin");

const {renderAdminPage, adminEdit} = require("../Controllers/adminController");

//render adminPage and let admin make changes

router.get("/admin", verifyAdmin, renderAdminPage);
router.post("/admin", adminEdit);

module.exports = router;
