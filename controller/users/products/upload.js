const mongoose = require('mongoose');
const constant = require('../../../utility/constants');
const mongoconnection = require('../../../utility/connection');
const responsemanager = require('../../../utility/response.manager');
const registermodel = require('../../../model/auth.model');
const config = require('../../../utility/config');
const { cloudinary } = require('../../../utility/cloudinary');
const fs = require('fs');
exports.upload = async (req, res) => {
    // console.log(req.token);
    if (req.token && mongoose.Types.ObjectId.isValid(req.token._id)) {
        let primary = mongoconnection.useDb(constant.balajisales);
        let adminData = await primary.model(constant.Model.userregisters, registermodel).findById(req.token._id).lean();
        if (adminData && adminData != null && adminData.Status === true) {
            let permission = await config.getadminPermission(adminData.roleid, 'products', 'InsertUpdate');
            if (permission) {
                if (req.files && req.files.length > 0) {
                    try {
                        const imageUrls = [];
                        for (const file of req.files) {
                            const result = await cloudinary.uploader.upload(file.path, {
                                folder: 'products',
                                public_id: file.originalname.split('.')[0] + '-' + Date.now(),
                                use_filename: true,
                                unique_filename: false,
                            });
                            imageUrls.push({
                                originalName: file.originalname,
                                url: result.secure_url,
                                public_id: result.public_id
                            });
                            // Delete temp file after upload
                            if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
                        }
                        return res.status(200).json({
                            status: true,
                            message: 'Files uploaded successfully',
                            files: imageUrls
                        });
                    } catch (err) {
                        return responsemanager.onError(err.message, res);
                    }
                } else {
                    return responsemanager.onBadRequest(
                        { message: 'No files provided. Please upload one or more images.' },
                        res
                    );
                }

            } else {
                return responsemanager.accessdenied(res);
            }
        } else {
            return responsemanager.unauthorisedRequest(res);
        }
    } else {
        return responsemanager.unauthorisedRequest(res);
    }

}

