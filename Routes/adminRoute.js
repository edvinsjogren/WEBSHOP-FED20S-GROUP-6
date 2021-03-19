const express = require("express");
const router = express.Router();
const multer = require("multer")

const verifyAdmin = require("../Middleware/verifyAdmin");
//const storage = require("../Middleware/multerUpload")
//const upload = multer({ storage: storage });

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
  cb(null, 'Public/Uploads')
  },
  filename: function (req, file, cb) {
  cb(null, file.fieldname + '-' + Date.now()+".png")
  }
  })
const upload = multer({ storage: storage })

const {
  renderAdminPage,
  adminSubmit,
  deleteProject,
  renderProjectForm,
  editProjectSubmit,
} = require("../Controllers/adminController");

//render adminPage and let admin make changes
router.get("/admin", verifyAdmin, renderAdminPage);
router.post("/admin", upload.single("image"), adminSubmit);

//let admin delete items from admin site
router.get("/delete/:id", verifyAdmin, deleteProject);

//let admin update 
router.get("/edit/:id", renderProjectForm)
router.post("/edit", editProjectSubmit)

module.exports = router;
