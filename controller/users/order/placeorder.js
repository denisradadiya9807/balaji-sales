const express = require('express');
const router = express.Router();
const constants = require('../../../utility/constants');
const mongoconnection = require('../../../utility/connection');
const config = require('../../../utility/config');
const mongoose = require('mongoose');
const responsemanager = require('../../../utility/response.manager');
const addtocart = require('../../../model/addtocart.model');
const adminmodel = require('../../../model/auth.model');

exports.orderplace = async (req, res) => {
    const { grandTotal, products, userid } = req.body;
    if (req.token && mongoose.Types.ObjectId.isValid(req.token._id)) {
        let primary = mongoconnection.useDb(constants.balajisales)
        let admindata = await primary.model(constants.Model.userregisters, adminmodel).findById(req.token._id)
        if (admindata && admindata != null && admindata.Status === true) {
            let permission = await config.getadminPermission(admindata.roleid, 'products', 'View');
            if (permission) {
                let cart = await primary.model(constants.Model.addtocarts, addtocart).findOne({ userid: req.token._id }).lean();
                if (!cart || !cart.products || cart.products.length === 0) {
                    return responsemanager.onBadRequest({ message: 'This Cart Is Empty' }, res);
                }
                let grandTotal = cart.products.reduce((sum, p) => sum + p.total, 0);
                let order = {
                    userid: req.token._id,
                    products: products,
                    grandTotal: grandTotal,
                    status: "pending"
                }
                let orders = await primary.model(constants.Model.orders, addtocart).create(order);
                cart.products = [];
                cart.grandTotal = 0;
                await primary.model(constants.Model.addtocarts, addtocart).updateOne(
                    { userid: req.token._id },
                    { $set: { products: [], grandTotal: 0 } }
                );
                return responsemanager.onSuccess('Order Place successfully...', orders, res);
            } else {
                return responsemanager.accessdenied(res)
            }
        } else {
            return responsemanager.unauthorisedRequest(res);
        }
    } else {
        return responsemanager.unauthorisedRequest(res);
    }
}
