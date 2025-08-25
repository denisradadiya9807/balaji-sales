const mongoose = require('mongoose');
const constant = require('../../../utility/constants');
const mongoconnection = require('../../../utility/connection');
const responsemanager = require('../../../utility/response.manager');
const registermodel = require('../../../model/auth.model');
const config = require('../../../utility/config');
const cloudinary = require('../../../utility/cloudinary');
exports.upload = async (req, res) => {
    if (req.token && mongoose.Types.ObjectId.isValid(req.token._id)) {
        let primary = mongoconnection.useDb(constant.balajisales);
        let adminData = await primary.model(constant.Model.userregisters, registermodel).findById(req.token._id)
        if (adminData && adminData != null && adminData.Status === true) {
            let permission = await config.getadminPermission(adminData.roleid, 'products', 'InsertUpdate');
            if (permission) {
                if (req.file) {

                    let uploadpaths = [];
                    async.forEachSeries(req.files, (file, next_file) => {
                        cloudinary.saveMultipart(file.buffer).then((result) => {
                            let f1 = result.data.Key.split("/");
                            let ext = result.data.Key.split(".");
                            let obj = {
                                path: result.data.Key,
                                // type: helper.getFileType(file.mimetype),
                                // mime: file.mimetype,
                                name: f1[f1.length - 1],
                                fileext: ext[ext.length - 1].toUpperCase(),
                                // filesizeinmb: parseFloat(sizeOfImageInMB).toFixed(2)
                            };
                            uploadpaths.push(obj);
                            next_file();
                        }).catch((error) => {
                            return responsemanager.onError(error, res);
                        });

                    }, () => {
                        return responsemanager.onSuccess('Files uploaded successfully...', uploadpaths, res);
                    });
                } else {

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