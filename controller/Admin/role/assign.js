const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const adminmodel = require('../../../model/admin.model');
const constants = require('../../../utility/constants');
const config = require('../../../utility/config');
const mongoconnection = require('../../../utility/connection');
const authmodel = require('../../../model/auth.model');
const ResponseManager = require('../../../utility/response.manager');
exports.roleassign = async (req, res) => {
    const { userid, roleid } = req.body;
    if (req.token && mongoose.Types.ObjectId.isValid(req.token._id)) {
        let primary = mongoconnection.useDb(constants.balajisales);
        let adminData = await primary.model(constants.Model.admins, adminmodel).findById(req.token._id).lean();
        if (adminData && adminData != null && adminData.status === true) {
            let getpermission = await config.getadminPermission(adminData.roleid, 'MainAdmin', 'InsertUpdate')
            if (getpermission) {
                if (!mongoose.Types.ObjectId.isValid(userid) || !mongoose.Types.ObjectId.isValid(roleid)) {
                    return ResponseManager.onBadRequest({ message: "Invalid Ids" }, res);
                }
                let user = await primary.model(constants.Model.userregisters, authmodel).findByIdAndUpdate(
                    userid,
                    { roleid: roleid },
                    { new: true }
                );
                if (!user) {
                    return ResponseManager.onBadRequest({ message: "Not assign Role Please Check It " }, res)
                }
                return ResponseManager.onSuccess('Role Assign Successfully...', user, res);
            } else {
                return ResponseManager.accessdenied(res);
            }
        } else {
            return ResponseManager.unauthorisedRequest(res);
        }
    } else {
        return ResponseManager.unauthorisedRequest(res);
    }
};
