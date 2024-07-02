const Banner = require("../models/banner");
const cloudinary = require("../../utils/cloudinary");
const { bannerSchema } = require("../../validators/authValidator");
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
        // Extract the public_id from the image URL
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
