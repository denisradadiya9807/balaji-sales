const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const adminmodel = require('../../../model/admin.model');
const constants = require('../../../utility/constants');
const config = require('../../../utility/config');
const mongoconnection = require('../../../utility/connection');
const rolemodel = require('../../../model/role.model');
const ResponseManager = require('../../../utility/response.manager');
exports.save = async (req, res) => {
    const { roleid, rolename, permissions } = req.body;
    // console.log("req.body->", req.body);
    if (req.token && mongoose.Types.ObjectId.isValid(req.token._id)) {
        // console.log(req.token);
        // console.log("token", req.token);
        // if (req.token && mongoose.Types.ObjectId.isValid(req.token.adminID)) {
        let primary = mongoconnection.useDb(constants.balajisales);
        let adminData = await primary.model(constants.Model.admins, adminmodel).findById(req.token._id).lean();
        if (adminData && adminData != null && adminData.status === true) {
            // console.log("adminData->", adminData);
            let getpermission = await config.getadminPermission(adminData.roleid, 'MainAdmin', 'InsertUpdate')
            if (getpermission) {
                if (rolename && rolename != '' && rolename != null && rolename != undefined) {
                    if (permissions && permissions != '' && permissions != null && permissions != undefined) {
                        if (roleid && roleid != '' && roleid != null && roleid != undefined && mongoose.Types.ObjectId.isValid(roleid)) {
                            let roleupdate = await primary.model(constants.Model.roles, rolemodel).findOneAndUpdate({ _id: new mongoose.Types.ObjectId(roleid) }, {
                                rolename: rolename,
                                permissions: permissions
                            },);
                            if (!roleupdate) {
                                return ResponseManager.onBadRequest({ message: 'Please Check rolename is not found...' }, res);
                            }
                            return ResponseManager.onSuccess('role updated sucessfully', roleupdate, res);
                        } else {
                            let existingrole = await primary.model(constants.Model.roles, rolemodel).findOne({ rolename: rolename }).lean();
                            if (!existingrole) {
                                const newrole = await primary.model(constants.Model.roles, rolemodel).create({
                                    rolename: rolename,
                                    permissions: permissions
                                });
                                return ResponseManager.onSuccess('role created successfully.....', newrole, res);
                            } else {
                                return ResponseManager.onBadRequest({ message: 'role already existing...!' }, res);
                            }
                        }
                    } else {
                        return ResponseManager.onBadRequest({ message: 'Enter And Valid Permission...' }, res);
                    }
                } else {
                    return ResponseManager.onBadRequest({ message: 'Enter Role Name...' }, res);
                }
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
