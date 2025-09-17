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
    const { variants, category, Product_name, Description, totalAmount, productid, orignalAmount, imageUrl, order } = req.body;
    if (req.token && mongoose.Types.ObjectId.isValid(req.token._id)) {
        let primary = mongoconnection.useDb(constants.balajisales);
        let admindata = await primary.model(constants.Model.userregisters, registermodel).findById(req.token._id).lean();
        if (admindata && admindata != null && admindata.Status === true) {
            let permission = await config.getadminPermission(admindata.roleid, 'products', 'InsertUpdate');
            if (permission) {
                if (category && category != '' && category != null && category != undefined) {
                    if (Description && Description != '' && Description != null && Description != undefined) {
                        if (Product_name && Product_name != '' && Product_name != null && Product_name != undefined) {
                            // if (price && price != '' && price != null && price != undefined) {
                            if (variants && variants != '' && variants != null && variants != undefined) {
                                if (orignalAmount && orignalAmount != '' && orignalAmount != null && orignalAmount != undefined) {
                                    if (totalAmount != null && totalAmount != undefined) {
                                        // const variants = [
                                        //     { type: "Patti", qty: 10, price: 5 },
                                        //     { type: "Carton", qty: 2, price: 100 }
                                        // ];

                                        let totalPriceCarton = 0;
                                        let totalPricePatti = 0;

                                        let processvarient = variants.map(v => {
                                            const totalPrice = v.price * v.qty;

                                            if (v.type === "Patti") totalPricePatti += totalPrice;
                                            if (v.type === "Carton") totalPriceCarton += totalPrice;

                                            return {
                                                ...v,
                                                totalPrice
                                            };
                                        });
                                        const TotalAmount = totalPricePatti + totalPriceCarton;
                                        if (productid && productid.trim() != '' && productid != null && productid != undefined && mongoose.Types.ObjectId.isValid(productid)) {
                                            let checkExist = await primary.model(constants.Model.products, productmodel).findOne({
                                                _id: { $ne: new mongoose.Types.ObjectId(productid) },
                                                Product_name: Product_name

                                            }).lean();
                                            if (checkExist == null) {
                                                let nextorder = 1
                                                if (!order) {
                                                    let maxorder = await primary.model(constants.Model.products, productmodel).findOne({}).sort({ order: -1 }).select('order').lean();
                                                    nextorder = maxorder ? maxorder.order + 1 : 1;
                                                }
                                                let obj = {
                                                    category: category,
                                                    Product_name: Product_name,
                                                    Description: Description,
                                                    variants: processvarient,
                                                    totalPricePatti: totalPricePatti,
                                                    totalPriceCarton: totalPriceCarton,
                                                    totalAmount: TotalAmount,
                                                    orignalAmount: orignalAmount,
                                                    isActive: true,
                                                    instock: true,
                                                    imageUrl: imageUrl,
                                                    order: (!isNaN(parseInt(order))) ? parseInt(order) : nextorder
                                                };
                                                await primary.model(constants.Model.products, productmodel).findByIdAndUpdate(productid, obj);
                                                let updatedclass = await primary.model(constants.Model.products, productmodel).findById(productid).lean();
                                                return responsemanager.onSuccess('product updated successfully...', updatedclass, res);
                                            } else {
                                                return responsemanager.onBadRequest({ message: 'Product already exist...!' }, res);
                                            }
                                        } else {
                                            let checkExist = await primary.model(constants.Model.products, productmodel).findOne({
                                                Product_name: new RegExp(["^", Product_name, "$"].join(""), "i"),
                                            }).lean();
                                            if (checkExist == null) {
                                                let nextorder = 1
                                                if (!order) {
                                                    let maxorder = await primary.model(constants.Model.products, productmodel).findOne({}).sort({ order: -1 }).select('order').lean();
                                                    nextorder = maxorder ? maxorder.order + 1 : 1;
                                                }
                                                let obj = {
                                                    category: category,
                                                    Product_name: Product_name,
                                                    Description: Description,
                                                    variants: processvarient,
                                                    totalPricePatti: totalPricePatti,
                                                    totalPriceCarton: totalPriceCarton,
                                                    totalAmount: TotalAmount,
                                                    orignalAmount: orignalAmount,
                                                    isActive: true,
                                                    instock: true,
                                                    imageUrl: imageUrl,
                                                    order: (!isNaN(parseInt(order))) ? parseInt(order) : nextorder
                                                };
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
                                return responsemanager.onBadRequest({ message: 'Please provide variants...' }, res);
                            }
                            // } else {
                            //     return responsemanager.onBadRequest({ message: 'Please Input price Field... ' }, res);
                            // }
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


