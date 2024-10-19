const Banner = require("../models/banner");
const cloudinary = require("../../utils/cloudinary");
const { bannerSchema } = require("../../validators/authValidator");
const mongoose = require("mongoose");
const Filel = require("../models/fileI");
exports.uploadBannerImage = async (req, res) => {
    try {
        const { error } = bannerSchema.validate(req.body);
        if (error) {
            return res.status(400).json(error.details[0].message);
        }
        if (!req.file) {
            return res.status(400).json({
                status: 0,
                message: "Missing required parameter - file"
            });
        }
        const result = await cloudinary.uploader.upload_stream({
            resource_type: 'image'
        }, async (error, result) => {
            if (error) {
                return res.status(500).json({
                    status: 0,
                    message: error.message.toString(),
                });
            }

            const banner = new Banner({
                imageUrl: result.secure_url,
                name: req.body.name, description: req.body.name
            });
            await banner.save();
            return res.status(201).json({
                success: true,
                message: "Banner image uploaded successfully"
            });
        }).end(req.file.buffer);

    } catch (error) {
        return res.status(500).json({
            status: 0,
            message: error.message.toString(),
        });
    }
};


exports.getAllBannerImage = async (req, res) => {
    try {
        const banner = await Banner.find()
        return res.status(200).json({
            status: 1,
            message: "Get all banner image successfully", banner
        })
    } catch (error) {
        return res.status(500).json({
            status: 0,
            message: error.message.toString(),
        })
    }
}

//token free api 
exports.getAllBanner = async (req, res) => {
    try {
        const banner = await Banner.find()
        return res.status(200).json({
            status: 1,
            message: "Get all banner image successfully", banner
        })
    } catch (error) {
        return res.status(500).json({
            status: 0,
            message: error.message.toString(),
        })
    }
}

exports.deleteBannerImage = async (req, res) => {
    try {
        const bannerId = req.params.id;
        const banner = await Banner.findById(bannerId);
        if (!banner) {
            return res.status(404).json({
                status: 0,
                message: "Banner  not found this Id"
            });
        }

        //Extract the public_id from the image URL
        const imageUrl = banner.imageUrl;
        const publicId = imageUrl.split('/').pop().split('.')[0];
        // Delete the image from Cloudinary
        cloudinary.uploader.destroy(publicId, async (error, result) => {
            if (error) {
                return res.status(500).json({
                    status: 0,
                    message: error.message.toString(),
                });
            }
            // Delete the banner document from MongoDB
            await Banner.findByIdAndDelete(bannerId);
            return res.status(200).json({
                status: 1,
                message: "Banner image and document deleted successfully"
            });
        });
    } catch (error) {
        return res.status(500).json({
            status: 0,
            message: error.message.toString(),
        });
    }
};


//TODO
exports.getOnebanner = async (req, res) => {
    try {
        const bannerId = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(bannerId)) {
            return res.status(400).json({ success: false, message: "Invalid banner ID" });
        }
        const getOnebanner = await Banner.findById(bannerId)
        if (!getOnebanner) {
            return res.status(400).json({
                success: false,
                message: "No any banner"
            })
        }
        return res.status(201).json({ success: true, message: "Get one banner sucessfully", getOnebanner });

    } catch (error) {
        return res.status(500).json({
            status: 0,
            message: error.message.toString(),
        })
    }

}



exports.updateBannerImage = async (req, res) => {
    try {
        const bannerId = req.params.id;
        if (!req.file) {
            return res.status(400).json({
                status: 0,
                message: "Missing required parameter - file"
            });
        }

        // Find the existing banner by ID
        const banner = await Banner.findById(bannerId);
        if (!banner) {
            return res.status(404).json({
                status: 0,
                message: "Banner not found"
            });
        }

        // Extract the public_id from the existing image URL
        const oldImageUrl = banner.imageUrl;
        const oldPublicId = oldImageUrl.split('/').pop().split('.')[0];

        // Delete the old image from Cloudinary
        cloudinary.uploader.destroy(oldPublicId, async (error, result) => {
            if (error) {
                return res.status(500).json({
                    status: 0,
                    message: error.message.toString(),
                });
            }
            // Upload the new image to Cloudinary
            cloudinary.uploader.upload_stream({ resource_type: 'image' }, async (error, result) => {
                if (error) {
                    return res.status(500).json({
                        status: 0,
                        message: error.message.toString(),
                    });
                }
                // Update the banner document with the new image URL
                banner.imageUrl = result.secure_url;
                banner.name = req.body.name || banner.name;
                banner.description = req.body.description || banner.description;
                await banner.save();
                return res.status(200).json({
                    success: true,
                    message: "Banner image updated successfully",
                    banner
                });
            }).end(req.file.buffer);
        });
    } catch (error) {
        return res.status(500).json({
            status: 0,
            message: error.message.toString(),
        });
    }
};
function byteConverter(bytes, decimals, only) {
    const K_UNIT = 1024;
    const SIZES = ["Bytes", "KB", "MB", "GB", "TB", "PB"];

    if (bytes == 0) return "0 Byte";

    if (only === "MB") return (bytes / (K_UNIT * K_UNIT)).toFixed(decimals) + " MB";

    let i = Math.floor(Math.log(bytes) / Math.log(K_UNIT));
    let resp = parseFloat((bytes / Math.pow(K_UNIT, i)).toFixed(decimals)) + " " + SIZES[i];

    return resp;
}


let bytesInput = 2100050090;
function byteConverter(bytes, decimals, only) {
    const K_UNIT = 1024;
    const SIZES = ["Bytes", "KB", "MB", "GB", "TB", "PB"];

    if (bytes == 0) return "0 Byte";

    if (only === "MB") return (bytes / (K_UNIT * K_UNIT)).toFixed(decimals) + " MB";

    let i = Math.floor(Math.log(bytes) / Math.log(K_UNIT));
    let resp = parseFloat((bytes / Math.pow(K_UNIT, i)).toFixed(decimals)) + " " + SIZES[i];

    return resp;
}

exports.updateImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ msg: 'No file selected' });
        }

        // Define file size limit (e.g., 10MB)
        const MAX_FILE_SIZE_MB = 10;
        const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

        // Check if file size exceeds the limit
        if (req.file.size > MAX_FILE_SIZE_BYTES) {
            return res.status(400).json({
                success: false,
                message: `File size exceeds the limit of ${MAX_FILE_SIZE_MB} MB`,
            });
        }

        // Create file URL based on file type
        let fileUrl;
        if (req.file.mimetype.startsWith('video')) {
            // If the file is a video
            fileUrl = `${req.protocol}://${req.get('host')}/uploads/videos/${req.file.filename}`;
        } else if (req.file.mimetype.startsWith('application/pdf') || 
                   req.file.mimetype.startsWith('application/msword') ||
                   req.file.mimetype.startsWith('application/vnd.openxmlformats-officedocument.wordprocessingml.document')) {
            // If the file is a document (PDF or Word file)
            fileUrl = `${req.protocol}://${req.get('host')}/uploads/docs/${req.file.filename}`;
        } else {
            // If the file is an image
            fileUrl = `${req.protocol}://${req.get('host')}/uploads/images/${req.file.filename}`;
        }

        // Convert file size to MB (rounded to 2 decimal places)
        const fileSizeMB = req.file.size;
        const nedata = byteConverter(fileSizeMB, 2); // Use byteConverter to get file size in MB
        console.log(nedata);

        // Save file info to MongoDB
        const newFile = new Filel({
            fileName: req.file.filename,
            fileUrl: fileUrl,
            fileType: req.file.mimetype,
            fileSize: nedata // Save the file size in MB
        });
        await newFile.save();

        return res.status(200).json({
            success: true,
            message: "File uploaded successfully",
            fileUrl: fileUrl,   // Include the file URL in the response
            fileSize: nedata + " MB" // Include file size in MB
        });
    } catch (error) {
        return res.status(500).json({
            status: 0,
            message: error.message.toString(),
        });
    }
};



exports.getAllfile = async (req, res) => {
    try {
        const { fileType } = req.query; // Get fileType from query parameters

        // Define filter condition based on fileType
        let filter = {};
        if (fileType === 'image') {
            filter.fileType = { $regex: /^image/ }; // Match all image types (e.g., image/jpeg, image/png)
        } else if (fileType === 'video') {
            filter.fileType = { $regex: /^video/ }; // Match all video types (e.g., video/mp4, video/mkv)
        } else if (fileType === 'document') {
            filter.fileType = { 
                $in: [
                    'application/pdf', 
                    'application/msword', 
                    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
                ] // Match document types (PDF, DOC, DOCX)
            };
        }

        // Retrieve files based on the filter
        const files = await Filel.find(filter);

        // Helper function to convert file size strings like "15.55 KB" to bytes
        const sizeToBytes = (sizeStr) => {
            const [value, unit] = sizeStr.split(" ");
            const size = parseFloat(value);
            const units = ["Bytes", "KB", "MB", "GB", "TB"];
            const index = units.indexOf(unit);
            return size * Math.pow(1024, index);
        };

        // Calculate total size in bytes
        let totalSizeBytes = 0;
        files.forEach(file => {
            totalSizeBytes += sizeToBytes(file.fileSize);
        });

        // Convert total size back to MB (or any desired format)
        const totalSize = (totalSizeBytes / (1024 * 1024)).toFixed(2);

        return res.status(200).json({
            status: 1,
            message: `Get all ${fileType || 'files'} successfully`,
            totalFileSizeMB: totalSize,
            fileCount: files.length,
            banner: files,
           
        });
    } catch (error) {
        return res.status(500).json({
            status: 0,
            message: error.message.toString(),
        });
    }
};
