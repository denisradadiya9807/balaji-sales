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
                    if (!mongoose.Types.ObjectId.isValid(productid)) {
                        return responsemanager.onBadRequest({ message: 'Product Id Not Valid' }, res);
                    }
                    let productdata = await primary.model(constants.Model.products, productmodel).findOne({ _id: new mongoose.Types.ObjectId(productid) })
                    if (!productdata) {
                        return responsemanager.onBadRequest({ message: 'Product Data Not Found...' }, res); s
                    }
                    let obj = {
                        productid: productid,
                        quantity: quantity
                    }
                    if (cartid) {
                        let updatedata = await primary.model(constants.Model.addtocarts, addtocart).findOneAndUpdate({ _id: new mongoose.Types.ObjectId(cartid) }, obj).lean();
                        if (updatedata) {
                            return responsemanager.onSuccess('The Addtocart UpdatebSuccess...', updatedata, res);
                        }
                        let exitingdata = await primary.model(constants.Model.addtocarts, addtocart).findOne({ productid: productid }).lean()
                        if (exitingdata) {
                            return responsemanager.onBadRequest({ message: " This Productid Is Already Exits in your cart..." }, res)
                        } else {
                            return responsemanager.unauthorisedRequest({ message: 'Updatedata Not updated ' }, res);
                        }

                    } else {
                        let addtocarts = await primary.model(constants.Model.addtocarts, addtocart).create(obj);
                        return responsemanager.onSuccess('Your Product Addto cart success', addtocarts, res)
                    }
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