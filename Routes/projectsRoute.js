const express = require("express");
const router = express.Router();
const verifyUser = require("../middleware/verifyUser");

const {projectsRender, projectsSubmit} = require("../Controllers/projectsController")

router.get("/projects", projectsRender)

router.post("/projects", verifyUser, projectsSubmit)

module.exports = router;