const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const adminmodel = require('../../../model/auth.model');
const constant = require('../../../utility/constants');
const config = require('../../../utility/config');
const mongoconnection = require('../../../utility/connection');
const productmodel = require('../../../model/product.model');
const responsemanager = require('../../../utility/response.manager');

exports.list = async (req, res) => {
    const { search } = req.body;
    if (req.token && mongoose.Types.ObjectId.isValid(req.token._id)) {
        const primary = mongoconnection.useDb(constant.balajisales);
        let adminData = await primary.model(constant.Model.userregisters, adminmodel).findById(req.token._id).lean();
        if (adminData && adminData != null && adminData.Status === true) {
            let getpermission = await config.getadminPermission(adminData.roleid, 'products', 'View');
            if (getpermission) {
                let productdata = await primary.model(constant.Model.products, productmodel).find({ Product_name: { '$regex': new RegExp(search, "i") }, }).lean();
                return responsemanager.onSuccess('products list...', productdata, res);
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
    if (req.token && mongoose.Types.ObjectId.isValid(req.token._id)) {
        let primary = mongoconnection.useDb(constant.balajisales);
        let adminData = await primary.model(constant.Model.userregisters, adminmodel).findById(req.token._id).lean();
        if (adminData && adminData != null && adminData.Status === true) {
            let getpermission = await config.getadminPermission(adminData.roleid, 'products', 'View');
            if (getpermission) {
                primary.model(constant.Model.products, productmodel).paginate({
                }, {
                    page,
                    limit: parseInt(limit),
                    sort: { _id: -1 },
                    lean: true
                }).then((productdata) => {
                    return responsemanager.onSuccess('products list...', productdata, res);
                }).catch((error) => {
                    return responsemanager.onError(error, res);
                })
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