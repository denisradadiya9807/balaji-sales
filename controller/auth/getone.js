const express = require('express');
const router = express.Router();
const constant = require('../../utility/constants');
const mongoConnection = require('../../utility/connection');
const config = require('../../utility/config');
const user = require('../../model/auth.model');
const mongoose = require('mongoose');
const responseManager = require('../../utility/response.manager');
exports.getone = async (req, res) => {
    const { userid } = req.body;
    if (req.token && mongoose.Types.ObjectId.isValid(req.token._id)) {
        const primary = mongoConnection.useDb(constant.balajisales);
        let adminData = await primary.model(constant.Model.userregisters, user).findById(req.token._id).lean();
        if (adminData && adminData != null && adminData.Status === true) {
            let getpermission = await config.getadminPermission(adminData.roleid, 'user', 'View');
            if (getpermission) {
                const userdata = await primary.model(constant.Model.userregisters, user).findOne({ _id: new mongoose.Types.ObjectId(userid) }).lean();
                if (userdata) {
                    return responseManager.onSuccess('user data victrive succeefully...', userdata, res);
                } else {
                    return responseManager.onBadRequest({ message: 'invalid userid' }, res);
                }
            } else {
                return responseManager.accessdenied(res);
            }
        } else {
            return responseManager.unauthorisedRequest(res);
        }
    } else {
        return responseManager.unauthorisedRequest(res);
    }
};