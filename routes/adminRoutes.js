const express = require("express");
const router = express.Router();
const adminAuth = require("../Middlewares/auth");
const ProjectController = require("../controllers/projectController");
const upload = require("../Middlewares/multer");


router.post("/createNewProject", upload.fields([
    { name: "projectImage", maxCount: 1 },
    { name: "projectVideo", maxCount: 1 }
]), adminAuth, ProjectController.createNewProject);


router.post("/updateProject/:token", upload.fields([
    { name: "projectImage", maxCount: 1 },
    { name: "projectVideo", maxCount: 1 }
]), adminAuth, ProjectController.updateProject);

router.post("/deleteProject/:token", adminAuth, ProjectController.deleteProject);

module.exports = router;