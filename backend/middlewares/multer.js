import multer from "multer";

// Configure where and how uploaded files will be stored
const storage = multer.diskStorage({

    // Folder where uploaded files will be saved
    destination: function (req, file, cb) {
        cb(null, "public");
    },

    // Generate a unique filename to avoid duplicate names
    filename: function (req, file, cb) {
        const filename = Date.now() + "-" + file.originalname;
        cb(null, filename);
    },
});

// Create Multer middleware with storage configuration
export const upload = multer({
    storage,

    // Maximum allowed file size: 5 MB
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
});