const multer = require('multer');
const path = require('path');

// Multer storage and file size limit setup
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (file.mimetype.startsWith('video')) {
            cb(null, './uploads/videos/');
        } else if (file.mimetype === 'application/pdf' || file.mimetype.startsWith('application/msword') || file.mimetype.startsWith('application/vnd.openxmlformats-officedocument.wordprocessingml.document')) {
            cb(null, './uploads/docs/');
        } else {
            cb(null, './uploads/images');
        }
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

exports.upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
}).single('file');

// Check file type (images, videos, PDFs, and docs allowed)
function checkFileType(file, cb) {
    const filetypes = /jpeg|jpg|png|mp4|mkv|avi|pdf|doc|docx/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: Only images, videos, PDFs, and documents are allowed!');
    }
}
