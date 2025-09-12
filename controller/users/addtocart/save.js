const express = require('express');
const router = express.Router();
const constants = require('../../../utility/constants');
const mongoconnection = require('../../../utility/connection');
const config = require('../../../utility/config');
const mongoose = require('mongoose');
const responsemanager = require('../../../utility/response.manager');
const addtocart = require('../../../model/addtocart.model');
const adminmodel = require('../../../model/auth.model');
const productmodel = require('../../../model/product.model');
exports.save = async (req, res) => {
    const { productid, quantity, cartid, total, price, totalAmount } = req.body;
    if (req.token && mongoose.Types.ObjectId.isValid(req.token._id)) {
        let primary = mongoconnection.useDb(constants.balajisales);
        let admindata = await primary.model(constants.Model.userregisters, adminmodel).findById(req.token._id).lean();
        if (admindata && admindata != null && admindata.Status === true) {
            let permission = await config.getadminPermission(admindata.roleid, 'products', 'InsertUpdate');
            if (permission) {
                if (quantity && quantity != '' && quantity != null && quantity != undefined) {
                    if (!mongoose.Types.ObjectId.isValid(productid)) {
                        return responsemanager.onBadRequest({ message: 'Invalid Product Id...' }, res);
                    }
                    let productdata = await primary.model(constants.Model.products, productmodel).findById(productid).lean();
                    if (!productdata) {
                        return responsemanager.onBadRequest({ message: 'Product Not Found' }, res);
                    }
                    let producttotal = productdata.totalAmount * quantity;
                    // let checkExist = await primary.model(constants.Model.addtocarts, addtocart).findOne({
                    //     // userid: req.token._id,
                    //     "products.productid": productdata._id
                    // }).lean();
                    // if (checkExist) {
                    //     return responsemanager.onBadRequest({ message: 'This Product Name Already Exists Pleaese Update' }, res);
                    // }
                    let cart = await primary.model(constants.Model.addtocarts, addtocart).findOne({ userid: req.token._id });
                    if (cart) {
                        console.log("update");
                        let index = cart.products.findIndex(p => p.productid.toString() === productid);
                        if (index > -1) {
                            cart.products[index].quantity = quantity;
                            cart.products[index].total = cart.products[index].quantity * cart.products[index].price;
                        } else {
                            cart.products.push({
                                productid: productid,
                                quantity: quantity,
                                price: productdata.totalAmount,
                                total: producttotal
                            });
                        }
                        cart.grandTotal = cart.products.reduce((sum, p) => sum + p.total, 0);
                        await cart.save();
                        return responsemanager.onSuccess("Cart Updated Successfully", cart, res);
                    } else {
                        console.log("create");
                        let obj = {
                            userid: req.token._id,
                            products: [{
                                productid: productid,
                                quantity: quantity,
                                price: productdata.totalAmount,
                                total: producttotal
                            }],
                            grandTotal: producttotal
                        };
                        let newcart = await primary.model(constants.Model.addtocarts, addtocart).create(obj);
                        return responsemanager.onSuccess('Product Added To cart...', newcart, res);
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