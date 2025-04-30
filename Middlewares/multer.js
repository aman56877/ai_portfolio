// middlewares/multerConfig.js
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const uploadPath = path.join(__dirname, "../public/assets/uploads");

// Ensure the upload directory exists
if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, "../public/assets/uploads"));
    },
    filename: function (req, file, cb) {
        const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueName + path.extname(file.originalname));
    }
});

const fileFilter = function (req, file, cb) {
    const allowedMimeTypes = [
        "image/jpeg",
        "image/png",
        "image/webp",
        "video/mp4",
        "video/quicktime",
        "video/x-matroska"
    ];
    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Only images and videos are allowed"), false);
    }
};

const upload = multer({ storage, fileFilter });

module.exports = upload;
