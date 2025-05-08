const Blog = require("../Models/Blogs");
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const fs = require("fs");


exports.createNewBlog = async (req, res) => {
    try {
        const {
            blogTitle,
            blogDescription,
            blogImage,
        } = req.body;
        const token = uuidv4();
        const requiredFields = ["blogTitle", "blogDescription"];
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
            const imageFile = req.files["blogImage"]?.[0];

            const imagePath = imageFile
                ? `/assets/uploads/${imageFile.filename}`
                : null;
            const newBlog = new Blog({
                blogTitle: blogTitle,
                blogDescription: blogDescription,
                blogImage: imagePath,
                token: token,
            });

            await newBlog.save();
            return res
                .status(201)
                .json({ message: "Blog created successfully", blog: newBlog });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

exports.updateBlog = async (req, res) => {
    try {
        const { token } = req.params;
        const { blogTitle, blogDescription } = req.body;

        const imageFile = req.files["blogImage"]?.[0];

        // Get the image/video paths
        const imagePath = imageFile
            ? `/assets/uploads/${imageFile.filename}`
            : null;

        // Find the existing blog
        const blog = await Blog.findOne({ token });

        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }

        // Delete old image if new one is uploaded
        if (imagePath && blog.blogImage) {
            const oldImagePath = path.join(__dirname, "../public", blog.blogImage);
            if (fs.existsSync(oldImagePath)) {
                fs.unlink(oldImagePath, (err) => {
                    if (err) console.error("Error deleting old image:", err);
                });
            } else {
                console.warn("Old image not found at:", oldImagePath);
            }
        }

        // Prepare the update payload dynamically
        const updateFields = {
            blogTitle,
            blogDescription,
        };

        // Only set new image or video if a new one was uploaded
        if (imagePath) {
            updateFields.blogImage = imagePath;
        }

        // Now update only the fields that changed
        const updatedblog = await Blog.findOneAndUpdate(
            { token },
            updateFields,
            { new: true }
        );


        return res
            .status(200)
            .json({
                message: "Blog updated successfully",
                blog: updatedblog,
            });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};


exports.deleteBlog = async (req, res) => {
    try {
        const { token } = req.params;

        // Find and delete the blog
        const deletedblog = await Blog.findOneAndDelete({ token });

        if (!deletedblog) {
            return res.status(404).json({ message: "Blog not found" });
        }

        // Delete image if exists
        if (deletedblog.blogImage) {
            const imagePath = path.join(
                __dirname,
                "../public",
                deletedblog.blogImage
            );
            fs.unlink(imagePath, (err) => {
                if (err) console.error("Error deleting image:", err);
            });
        }

        return res.status(200).json({ message: "Blog deleted successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};


exports.getAllBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find({});
        return res.status(200).json({ blogs });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};