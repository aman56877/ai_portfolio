const mongoose = require("mongoose");

const ProjectSchema = new mongoose.Schema({
    projectName: {
        type: String,
        required: true,
    },
    projectDescription: {
        type: String,
        required: true,
    },
    projectImage: {
        type: String,
        // required: true,
    },
    projectVideo: {
        type: String,
        // required: true,
    },
    token: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Project = mongoose.model("Project", ProjectSchema);
module.exports = Project;