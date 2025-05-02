const Project = require("../Models/Projects");
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const fs = require("fs");

exports.createNewProject = async (req, res) => {
    try {
        const {
            projectName,
            projectDescription,
            projectImage,
            projectLink,
            projectVideo,
        } = req.body;
        const token = uuidv4();
        const requiredFields = ["projectName", "projectDescription", "projectLink"];
        const errors = [];

        requiredFields.forEach((field) => {
            if (!req.body[field]) {
                errors.push(
                    `${field.charAt(0).toUpperCase() + field.slice(1)} field is required`
                );
            }
        });

        if (errors.length > 0) {
            return res.status(400).json({ message: errors.join(", ") });
        } else {
            const imageFile = req.files["projectImage"]?.[0];
            const videoFile = req.files["projectVideo"]?.[0];

            const imagePath = imageFile
                ? `/assets/uploads/${imageFile.filename}`
                : null;
            const videoPath = videoFile
                ? `/assets/uploads/${videoFile.filename}`
                : null;
            const newProject = new Project({
                projectName: projectName,
                projectDescription: projectDescription,
                projectLink: projectLink,
                projectImage: imagePath,
                projectVideo: videoPath,
                token: token,
            });

            await newProject.save();
            return res
                .status(201)
                .json({ message: "Project created successfully", project: newProject });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

exports.updateProject = async (req, res) => {
    try {
        const { token } = req.params;
        const { projectName, projectDescription, projectLink } = req.body;

        const imageFile = req.files["projectImage"]?.[0];
        const videoFile = req.files["projectVideo"]?.[0];

        // Get the image/video paths
        const imagePath = imageFile
            ? `/assets/uploads/${imageFile.filename}`
            : null;
        const videoPath = videoFile
            ? `/assets/uploads/${videoFile.filename}`
            : null;

        // Find the existing project
        const project = await Project.findOne({ token });

        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        // Delete old image if new one is uploaded
        if (imagePath && project.projectImage) {
            const oldImagePath = path.join(__dirname, "../public", project.projectImage);
            if (fs.existsSync(oldImagePath)) {
                fs.unlink(oldImagePath, (err) => {
                    if (err) console.error("Error deleting old image:", err);
                });
            } else {
                console.warn("Old image not found at:", oldImagePath);
            }
        }

        // Delete old video if new one is uploaded
        if (videoPath && project.projectVideo) {
            const oldVideoPath = path.join(__dirname, "../public", project.projectVideo);
            if (fs.existsSync(oldVideoPath)) {
                fs.unlink(oldVideoPath, (err) => {
                    if (err) console.error("Error deleting old video:", err);
                });
            } else {
                console.warn("Old video not found at:", oldVideoPath);
            }
        }

        // Prepare the update payload dynamically
        const updateFields = {
            projectName,
            projectDescription,
            projectLink,
        };

        // Only set new image or video if a new one was uploaded
        if (imagePath) {
            updateFields.projectImage = imagePath;
        }

        if (videoPath) {
            updateFields.projectVideo = videoPath;
        }

        // Now update only the fields that changed
        const updatedProject = await Project.findOneAndUpdate(
            { token },
            updateFields,
            { new: true }
        );


        return res
            .status(200)
            .json({
                message: "Project updated successfully",
                project: updatedProject,
            });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

exports.deleteProject = async (req, res) => {
    try {
        const { token } = req.params;

        // Find and delete the project
        const deletedProject = await Project.findOneAndDelete({ token });

        if (!deletedProject) {
            return res.status(404).json({ message: "Project not found" });
        }

        // Delete image if exists
        if (deletedProject.projectImage) {
            const imagePath = path.join(
                __dirname,
                "../public",
                deletedProject.projectImage
            );
            fs.unlink(imagePath, (err) => {
                if (err) console.error("Error deleting image:", err);
            });
        }

        // Delete video if exists
        if (deletedProject.projectVideo) {
            const videoPath = path.join(
                __dirname,
                "../public",
                deletedProject.projectVideo
            );
            fs.unlink(videoPath, (err) => {
                if (err) console.error("Error deleting video:", err);
            });
        }

        return res.status(200).json({ message: "Project deleted successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
