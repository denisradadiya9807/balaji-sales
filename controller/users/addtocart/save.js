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
const addtocart = require('../../../model/addtocart.model');
const productmodel = require('../../../model/product.model');
const adminmodel = require('../../../model/auth.model');
exports.save = async (req, res) => {
    const { productid, quantity, cartid } = req.body;
    if (req.token && mongoose.Types.ObjectId.isValid(req.token._id)) {
        let primary = mongoconnection.useDb(constants.balajisales);
        let admindata = await primary.model(constants.Model.userregisters, adminmodel).findById(req.token._id).lean();
        if (admindata && admindata != null && admindata.Status === true) {
            let permission = await config.getadminPermission(admindata.roleid, 'products', 'InsertUpdate');
            if (permission) {
                if (quantity && quantity != '' && quantity != null && quantity != undefined) {
                    if (cartid && mongoose.Types.ObjectId.isValid(cartid)) {
                        let updatedata = await primary.model(constants.Model.addtocarts, addtocart).findOneAndUpdate({ _id: new mongoose.Types.ObjectId(cartid) }, { quantity }, { new: true }).lean();
                        if (updatedata) {
                            return responsemanager.onSuccess('Cart Update Success', updatedata, res);
                        } else {
                            return responsemanager.onBadRequest({ message: "Cart Iteam Not Found" }, res);
                        }
                    }
                    if (!mongoose.Types.ObjectId.isValid(productid)) {
                        return responsemanager.onBadRequest({ message: "Invalid Product Id" }, res);
                    }
                    let existing = await primary.model(constants.Model.addtocarts, addtocart).findOne({ productid: productid }).lean();
                    if (existing) {
                        return responsemanager.onBadRequest({ message: "This Product is already in your cart" }, res);
                    }
                    let newcart = await primary.model(constants.Model.addtocarts, addtocart).create({ productid, quantity });
                    return responsemanager.onSuccess('Product added To cart success', newcart, res);
                } else {
                    return responsemanager.onBadRequest({ message: "Product quantity require.." }, res);
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