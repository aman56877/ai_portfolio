const express = require("express");
const router = express.Router();
const adminAuth = require("../Middlewares/auth");
const ProjectController = require("../controllers/projectController");
const BlogController = require("../controllers/blogController");
const upload = require("../Middlewares/multer");

// Project Routes
router.post("/createNewProject", upload.fields([
    { name: "projectImage", maxCount: 1 },
    { name: "projectVideo", maxCount: 1 }
]), adminAuth, ProjectController.createNewProject);


router.post("/updateProject/:token", upload.fields([
    { name: "projectImage", maxCount: 1 },
    { name: "projectVideo", maxCount: 1 }
]), adminAuth, ProjectController.updateProject);

router.post("/deleteProject/:token", adminAuth, ProjectController.deleteProject);

router.get("/getAllProjects", ProjectController.getAllProjects);


// Blog Routes
router.post("/createNewBlog", upload.fields([
    { name: "blogImage", maxCount: 1 },
]), adminAuth, BlogController.createNewBlog);

router.post("/updateBlog/:token", upload.fields([
    { name: "blogImage", maxCount: 1 },
]), adminAuth, BlogController.updateBlog);

router.post("/deleteBlog/:token", adminAuth, BlogController.deleteBlog);

router.get("/getAllBlogs", BlogController.getAllBlogs);

module.exports = router;