const express = require('express');
const router = express.Router();
const constant = require('../../../utility/constants');
const mongoConnection = require('../../../utility/connection');
const config = require('../../../utility/config');
const model = require('../../../model/category.model');
const registermodel = require('../../../model/auth.model');
const mongoose = require('mongoose');
const responseManager = require('../../../utility/response.manager');
exports.list = async (req, res) => {
    if (req.token && mongoose.Types.ObjectId.isValid(req.token._id)) {
        const primary = mongoConnection.useDb(constant.balajisales);
        let adminData = await primary.model(constant.Model.userregisters, registermodel).findById(req.token._id).lean();
        if (adminData && adminData != null && adminData.Status === true) {
            let permission = await config.getadminPermission(adminData.roleid, 'products', 'InsertUpdate');
            if (permission) {
                const { } = req.body;
                const primary = mongoConnection.useDb(constant.balajisales);
                let leaddata = await primary.model(constant.Model.categories, model).find({}).lean();
                // console.log("123 ", leaddata);
                let customdata = leaddata.map(iteam => ({
                    Email: iteam.Email,
                    Shop_Name: iteam.Shop_Name,
                    Shop_Owner_Name: iteam.Shop_Owner_Name,
                    Mobile_Number: iteam.Mobile_Number,
                    Alternate_Mobile_Number: iteam.Alternate_Mobile_Number,
                    Address: iteam.Address
                }));
                return responseManager.onSuccess('lead list...', customdata, res);
            } else {
                return responseManager.accessdenied(res);
            }
        } else {
            return responseManager.unauthorisedRequest(res);
        }
    } else {
        return responseManager.unauthorisedRequest(res);
    }
}

