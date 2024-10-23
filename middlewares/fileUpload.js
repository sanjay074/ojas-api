const multer = require('multer');
const path = require('path');

https://chatgpt.com/share/67193184-9ab0-800f-a869-9f57aa744f9a






const express = require('express');
const router = express.Router();
const AccessCode = require('../models/AccessCode'); // Assuming you have this model

router.post('/generate-access-code', async (req, res) => {
    const { type } = req.body;

    let duration;
    if (type === 'training-part') {
        duration = 240; // 4 hours in minutes
    } else if (type === 'coaching-session') {
        duration = 90; // 90 minutes
    } else {
        return res.status(400).send({ error: 'Invalid reservation type' });
    }

    const code = new AccessCode({
        code: generateUniqueCode(), // Function to generate random codes
        type,
        duration,
        expiresAt: null, // Optionally, add logic to set expiry
    });

    try {
        await code.save();
        res.status(201).send({ code });
    } catch (error) {
        res.status(500).send({ error: 'Error creating access code' });
    }
});

function generateUniqueCode() {
    return Math.random().toString(36).substring(2, 10).toUpperCase(); // Example code generation
}

module.exports = router;



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
