const express = require("express");
const router = express.Router();

const verifyAdmin = require("../Middleware/verifyAdmin");
const {upload} = require("../Middleware/multerUpload");

const {
  renderAdminPage,
  adminSubmit,
  deleteProject,
  renderProjectForm,
  editProjectSubmit,
} = require("../Controllers/adminController");

//render adminPage and let admin make changes
router.get("/admin", verifyAdmin, renderAdminPage);
router.post("/admin", upload.single("image"), verifyAdmin, adminSubmit);

//let admin delete items from admin site
router.get("/delete/:id", verifyAdmin, deleteProject);

//let admin update
router.get("/edit/:id", verifyAdmin, renderProjectForm);
router.post("/edit", upload.single("image"), verifyAdmin, editProjectSubmit);

module.exports = router;
