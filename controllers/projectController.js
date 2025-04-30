const Project = require("../Models/Projects");
const { v4: uuidv4 } = require("uuid");




exports.createNewProject = async (req, res) => {
    try {
        const { projectName, projectDescription, projectImage, projectLink, projectVideo } = req.body;
        const token = uuidv4();
        const requiredFields = ['projectName', 'projectDescription', 'projectLink'];
        const errors = [];

        requiredFields.forEach(field => {
            if (!req.body[field]) {
                errors.push(`${field.charAt(0).toUpperCase() + field.slice(1)} field is required`);
            }
        });

        if (errors.length > 0) {
            return res.status(400).json({ message: errors.join(", ") });
        }else{

            const imageFile = req.files["projectImage"]?.[0];
            const videoFile = req.files["projectVideo"]?.[0];

            const imagePath = imageFile ? `/assets/uploads/${imageFile.filename}` : null;
            const videoPath = videoFile ? `/assets/uploads/${videoFile.filename}` : null;
            const newProject = new Project({
                projectName: projectName,
                projectDescription: projectDescription,
                projectLink: projectLink,
                projectImage: imagePath,
                projectVideo: videoPath,
                token: token,
            });
    
            await newProject.save();
            return res.status(201).json({ message: "Project created successfully", project: newProject });
        }        
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}