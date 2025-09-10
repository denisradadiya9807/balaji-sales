const express = require('express');
const router = express.Router();
const constants = require('../../../utility/constants');
const mongoconnection = require('../../../utility/connection');
const config = require('../../../utility/config');
const mongoose = require('mongoose');
const responsemanager = require('../../../utility/response.manager');
const addtocart = require('../../../model/addtocart.model');
const adminmodel = require('../../../model/auth.model');
exports.delete = async (req, res) => {
    const { cartid } = req.body;
    if (req.token && mongoose.Types.ObjectId.isValid(req.token._id)) {
        let primary = mongoconnection.useDb(constants.balajisales)
        let admindata = await primary.model(constants.Model.userregisters, adminmodel).findById(req.token._id)
        if (admindata && admindata != null && admindata.Status === true) {
            let permission = await config.getadminPermission(admindata.roleid, 'products', 'Delete');
            if (permission) {
                let cart = await primary.model(constants.Model.addtocarts, addtocart).findOneAndDelete({ _id: new mongoose.Types.ObjectId(cartid) }).lean();
                if (cart) {
                    return responsemanager.onSuccess('Your Delete Success.', cart, res);
                }
                else {
                    return responsemanager.onBadRequest({ message: 'not found cart' }, res);
                }
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