const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const adminmodel = require('../../../model/admin.model');
const constant = require('../../../utility/constants');
const config = require('../../../utility/config');
const mongoconnection = require('../../../utility/connection');
const rolemodel = require('../../../model/role.model');
const responsemanager = require('../../../utility/response.manager');

exports.rolelist = async (req, res) => {
    const { search } = req.body;
    // console.log(req.token.adminid);
    // console.log("✅ Valid ObjectId:", mongoose.Types.ObjectId.isValid(req.token?.adminid));
    if (req.token && mongoose.Types.ObjectId.isValid(req.token.adminid)) {
        const primary = mongoconnection.useDb(constant.balajisales);
        let adminData = await primary.model(constant.Model.admins, adminmodel).findById(req.token.adminid).lean();
        if (adminData && adminData != null && adminData.status === true) {
            let getpermission = await config.getadminPermission(adminData.roleid, 'roles', 'View');
            console.log('123=>', getpermission);
            if (getpermission) {
                let roleData = await primary.model(constant.Model.roles, rolemodel).find({ roleName: { '$regex': new RegExp(search, "i") }, }).lean();
                return responsemanager.onSuccess('roles list...', roleData, res);
            } else {
                return responsemanager.accessdenied(res);
            }
        } else {
            return responsemanager.unauthorisedRequest(res);
        }
    } else {
        return responsemanager.unauthorisedRequest(res);
    }
};
exports.withpagination = async (req, res) => {
    const { page, limit } = req.body;
    if (req.token && mongoose.Types.ObjectId.isValid(req.token.adminId)) {
        let primary = mongoconnection.useDb(constant.school);
        let adminData = await primary.model(constant.Model.admins, adminmodel).findById(req.token.adminId).lean();
        if (adminData && adminData != null && adminData.status === true) {
            primary.model(constant.Model.roles, rolemodel).paginate({
            }, {
                page,
                limit: parseInt(limit),
                sort: { _id: -1 },
                lean: true
            }).then((roleData) => {
                return responsemanager.onSuccess('role Data...', roleData, res);
            }).catch((error) => {
                return responsemanager.onError(error, res);
            })
        } else {
            return responsemanager.unauthorisedRequest(res);
        }
    } else {
        return responsemanager.unauthorisedRequest(res);
    }
};