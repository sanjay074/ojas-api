const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
    fileName: String,
    fileUrl: String,
    fileType: String,
    fileSize:String,
    uploadDate: {
        type: Date,
        default: Date.now
    }
});
module.exports = mongoose.model('File', fileSchema);

