const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const adminmodel = require('../../../model/auth.model');
const constant = require('../../../utility/constants');
const config = require('../../../utility/config');
const mongoconnection = require('../../../utility/connection');
const productmodel = require('../../../model/product.model');
const responsemanager = require('../../../utility/response.manager');
const rolemodel = require('../../../model/role.model');
exports.list = async (req, res) => {
    const { page, limit, search, sortoption, rolas } = req.body;
    if (req.token && mongoose.Types.ObjectId.isValid(req.token._id)) {
        let primary = mongoconnection.useDb(constant.balajisales);
        let adminData = await primary.model(constant.Model.userregisters, adminmodel).findById(req.token._id).lean();
        // console.log(req.token._id);
        if (adminData && adminData != null && adminData.Status === true) {
            console.log("admindata", adminData.roleid);
            let getpermission = await config.getadminPermission(adminData.roleid, 'products', 'View');
            // console.log(getpermission);
            if (getpermission) {
                const query = {};
                if (search && search.trim() !== '') {
                    query.Product_name = { $regex: new RegExp(search.trim(), 'i') };
                }
                let ADMIN_ROLE = await primary.model(constant.Model.roles, rolemodel).findOne({ rolename: "Admin", _id: new mongoose.Types.ObjectId(rolas) }).lean();
                if (adminData.roleid.toString() !== rolas) {
                    // console.log("User is Admin");
                    query.isActive = true;
                }
                const sortorder = {};
                if (sortoption === 'pricehightolow') {
                    sortorder.price = -1;
                } else if (sortoption === 'pricelowtohigh') {
                    sortorder.price = 1;
                } else if (sortoption === 'ATOZ') {
                    sortorder.Product_name = 1;
                } else if (sortoption === 'ZTOA') {
                    sortorder.Product_name = -1;
                } else {
                    sortorder.order = 1
                }
                primary.model(constant.Model.products, productmodel).paginate(query, {
                    page,
                    limit: parseInt(limit),
                    sort: sortorder,
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
exports.reorderlist = async (req, res) => {
    if (req.token && mongoose.Types.ObjectId.isValid(req.token._id)) {
        let primary = mongoconnection.useDb(constant.balajisales);
        let adminData = await primary.model(constant.Model.userregisters, adminmodel).findById(req.token._id).lean();
        if (adminData && adminData != null && adminData.Status === true) {
            let getpermission = await config.getadminPermission(adminData.roleid, 'products', 'View');
            if (getpermission) {
                try {
                    const { reorderlist } = req.body;
                    if (!Array.isArray(reorderlist) || reorderlist.length === 0) {
                        return res.status(400).json({ error: 'reorderlist must be a non-empty array of product IDs' });
                    }
                    let updatedlist = [];
                    for (let i = 0; i < reorderlist.length; i++) {
                        if (mongoose.Types.ObjectId.isValid(reorderlist[i])) {
                            await primary.model(constant.Model.products, productmodel).findByIdAndUpdate(reorderlist[i], { order: i });
                            updatedlist.push({
                                _id: reorderlist[i],
                                order: i
                            })
                        }
                    }
                    return responsemanager.onSuccess('Order List Update Successfully...', updatedlist, res);
                } catch (error) {
                    res.Status(500).json({ error: 'Failed Thie List Update' });
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
};