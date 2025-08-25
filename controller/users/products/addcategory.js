const express = require('express');
const router = express.Router();
const helper = require('../../../utility/helper');
const constants = require('../../../utility/constants');
const mongoconnection = require('../../../utility/connection');
const config = require('../../../utility/config');
const mongoose = require('mongoose');
const registermodel = require('../../../model/auth.model');
const responsemanager = require('../../../utility/response.manager');
const categorymodel = require('../../../model/category.model');
exports.addcategory = async (req, res) => {
    const { category_name, categoryid } = req.body;
    if (req.token && mongoose.Types.ObjectId.isValid(req.token._id)) {
        const primary = mongoconnection.useDb(constants.balajisales);
        let adminData = await primary.model(constants.Model.userregisters, registermodel).findById(req.token._id).lean();
        if (adminData && adminData != null && adminData.Status === true) {
            let permission = await config.getadminPermission(adminData.roleid, 'products', 'InsertUpdate');
            if (permission) {
                let exist = await primary.model(constants.Model.categories, categorymodel).findOne({ category_name: category_name }).lean()
                if (exist) {
                    return responsemanager.onBadRequest({ message: "This Category already Exits" }, res);
                }
                let obj = {
                    category_name: category_name
                }
                if (categoryid) {
                    let updatecategory = await primary.model(constants.Model.categories, categorymodel).findOneAndUpdate({ _id: new mongoose.Types.ObjectId(categoryid) }).lean();
                    if (updatecategory) {
                        return responsemanager.onSuccess('This Category is Update Successfully...', updatecategory, res);
                    }
                    return responsemanager.onBadRequest({ message: 'This Id Not Found' }, res); 
                } else {
                    let create = await primary.model(constants.Model.categories, categorymodel).create(obj);
                    return responsemanager.onSuccess('Created Category Successfully...', create, res);
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