const mongoose = require('mongoose');

const BlogSchema = new mongoose.Schema({
    blogTitle: {
        type: String,
        required: true,
    },
    blogDescription: {
        type: String,
        required: true,
    },
    blogImage: {
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


const Blog = mongoose.model("Blog", BlogSchema);
module.exports = Blog;