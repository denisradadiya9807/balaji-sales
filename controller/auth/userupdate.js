const express = require('express');
const router = express.Router();
const registermodel = require('../../model/auth.model');
const constants = require('../../utility/constants');
const mongoConection = require('../../utility/connection');
const responseManager = require('../../utility/response.manager');
const config = require('../../utility/config');
const mongoose = require('mongoose');

exports.userupdate = async (req, res) => {
    const { Userid, Username, Shop_Name, Shop_Owner_Name, Mobile_Number, Alternate_Mobile_Number, Address, roleid, Route } = req.body;
    // console.log(req.token);
    if (req.token && mongoose.Types.ObjectId.isValid(req.token._id)) {
        let primary = mongoConection.useDb(constants.balajisales);
        let adminmodel = await primary.model(constants.Model.userregisters, registermodel).findById(req.token._id).lean();
        // console.log(adminmodel);
        if (adminmodel && adminmodel.Status === true) {
            let permission = await config.getadminPermission(adminmodel.roleid, 'admins', 'InsertUpdate');
            // console.log(permission);
            if (permission) {
                if (Userid && mongoose.Types.ObjectId.isValid(Userid)) {
                    let obj = {
                        Username,
                        Shop_Name,
                        Shop_Owner_Name,
                        Mobile_Number,
                        Alternate_Mobile_Number,
                        Address,
                        roleid,
                        Route
                    }
                    let updateuser = await primary.model(constants.Model.userregisters, registermodel).findOneAndUpdate({ _id: new mongoose.Types.ObjectId(Userid) }, { $set: obj }, { new: true }).lean();
                    if (updateuser) {
                        return responseManager.onSuccess({ message: 'User updated successfully' }, updateuser, res);
                    }
                } else {
                    return responseManager.onBadRequest({ message: 'User not found' }, res);
                }
            } else {
                return responseManager.accessdenied(res);
            }
        } else {
            return responseManager.onBadRequest({ message: 'status' }, res);
        }

    } else {
        return responseManager.onBadRequest({ message: 'token' }, res);
    }



}


