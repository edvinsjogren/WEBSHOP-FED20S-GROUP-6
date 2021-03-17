const express = require("express");
const router = express.Router();
//const verifyAdmin = require("../middleware/verifyAdmin");

const { adminRender, adminSubmit } = require("../Controllers/adminController");

router.get("/admin", verifyAdmin, adminRender);
router.post("/admin", verifyAdmin, adminSubmit);

module.exports = router;