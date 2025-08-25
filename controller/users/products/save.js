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
const productmodel = require('../../../model/product.model');
const async = require('async');

exports.save = async (req, res) => {
    const { product_type, category, Product_name, Description, patti, Quantity_patti, Single_pcs, price, QtyInCartoon, totalAmount, productid, subjectids, orignalAmount } = req.body;
    if (req.token && mongoose.Types.ObjectId.isValid(req.token._id)) {
        let primary = mongoconnection.useDb(constants.balajisales);
        let admindata = await primary.model(constants.Model.userregisters, registermodel).findById(req.token._id).lean();
        if (admindata && admindata != null && admindata.Status === true) {
            let permission = await config.getadminPermission(admindata.roleid, 'products', 'InsertUpdate');
            if (permission) {
                if (category && category != '' && category != null && category != undefined) {
                    if (Description && Description != '' && Description != null && Description != undefined) {
                        if (Product_name && Product_name != '' && Product_name != null && Product_name != undefined) {
                            if (price && price != '' && price != null && price != undefined) {
                                if (QtyInCartoon && QtyInCartoon != '' && QtyInCartoon != null && QtyInCartoon != undefined) {
                                    if (orignalAmount && orignalAmount != '' && orignalAmount != null && orignalAmount != undefined) {
                                        if (totalAmount != null && totalAmount != undefined) {
                                            if (productid && productid.trim() != '' && productid != null && productid != undefined && mongoose.Types.ObjectId.isValid(productid)) {
                                                let checkExist = await primary.model(constants.Model.products, productmodel).findOne({
                                                    _id: { $ne: new mongoose.Types.ObjectId(productid) },
                                                    $and: [
                                                        { Product_name: Product_name },
                                                        { product_type: product_type }
                                                    ]
                                                }).lean();
                                                if (checkExist == null) {
                                                    let amount = price * QtyInCartoon;
                                                    let obj = {
                                                        product_type: product_type,
                                                        category: category,
                                                        Product_name: Product_name,
                                                        Description: Description,
                                                        // patti: patti,
                                                        // Quantity_patti: Quantity_patti,
                                                        // Single_pcs: Single_pcs,
                                                        price: price,
                                                        QtyInCartoon: QtyInCartoon,
                                                        totalAmount: amount,
                                                        orignalAmount: orignalAmount,
                                                        active: true,
                                                        instock: true,
                                                    };
                                                    if (product_type === 'patti') {
                                                        obj.Quantity_patti = Quantity_patti
                                                    }
                                                    await primary.model(constants.Model.products, productmodel).findByIdAndUpdate(productid, obj);
                                                    let updatedclass = await primary.model(constants.Model.products, productmodel).findById(productid).lean();
                                                    return responsemanager.onSuccess('product updated successfully...', updatedclass, res);
                                                } else {
                                                    return responsemanager.onBadRequest({ message: 'Product already exist...!' }, res);
                                                }
                                            } else {
                                                let checkExist = await primary.model(constants.Model.products, productmodel).findOne({
                                                    $and: [
                                                        { Product_name: new RegExp(["^", Product_name, "$"].join(""), "i") },
                                                        { product_type: product_type }
                                                    ]
                                                }).lean();
                                                if (checkExist == null) {
                                                    let amount = price * QtyInCartoon;
                                                    let obj = {
                                                        product_type: product_type,
                                                        category: category,
                                                        Product_name: Product_name,
                                                        Description: Description,
                                                        // patti: patti,
                                                        // Quantity_patti: Quantity_patti,
                                                        // Single_pcs: Single_pcs,
                                                        price: price,
                                                        QtyInCartoon: QtyInCartoon,
                                                        totalAmount: amount,
                                                        orignalAmount: orignalAmount,
                                                        active: true,
                                                        instock: true,
                                                    };
                                                    if (product_type == 'patti') {
                                                        obj.Quantity_patti = Quantity_patti
                                                    }
                                                    let newClass = await primary.model(constants.Model.products, productmodel).create(obj);
                                                    return responsemanager.onSuccess('product added successfully...', newClass, res);
                                                } else {
                                                    return responsemanager.onBadRequest({ message: 'product already exist...!' }, res);
                                                }
                                            }
                                        } else {
                                            return responsemanager.onBadRequest({ message: 'Please Input totalAmount Field... ' }, res);
                                        }
                                    } else {
                                        return responsemanager.onBadRequest({ message: 'Please Input orignalAmount Field... ' }, res);
                                    }
                                } else {
                                    return responsemanager.onBadRequest({ message: 'Please Input QtyInCartoon Field... ' }, res);
                                }
                            } else {
                                return responsemanager.onBadRequest({ message: 'Please Input price Field... ' }, res);
                            }
                        } else {
                            return responsemanager.onBadRequest({ message: 'Please Input Product_name Field... ' }, res);
                        }
                    } else {
                        return responsemanager.onBadRequest({ message: 'Please Input Description Field... ' }, res);
                    }

                } else {
                    return responsemanager.onBadRequest({ message: 'Please Input category Field... ' }, res);
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


