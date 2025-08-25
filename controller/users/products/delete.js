const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const adminmodel = require('../../../model/auth.model');
const constants = require('../../../utility/constants');
const config = require('../../../utility/config');
const mongoconnection = require('../../../utility/connection');
const productmodel = require('../../../model/product.model');
const responseManager = require('../../../utility/response.manager');
exports.delete = async (req, res) => {
    const { productid } = req.body
    if (req.token && mongoose.Types.ObjectId.isValid(req.token._id)) {
        let primary = mongoconnection.useDb(constants.balajisales);
        let classs = await primary.model(constants.Model.userregisters, adminmodel).findById(req.token._id).lean();
        if (classs && classs != null && classs.Status === true) {
            let havepermissions = await config.getadminPermission(classs.roleid, 'products', 'Delete');
            if (havepermissions) {
                if (!mongoose.Types.ObjectId.isValid(productid)) {
                    return responseManager.onBadRequest({ message: "This Id Is Not valid please check id" }, res);
                }
                let abc = await primary.model(constants.Model.products, productmodel).findOneAndDelete({ _id: new mongoose.Types.ObjectId(productid) }).lean();
                if (abc) {
                    return responseManager.onSuccess('Product Delete Successfully...', abc, res);
                } else {
                    return responseManager.onBadRequest({ message: 'This Is not Found' }, res);
                }
            } else {
                return responseManager.accessdenied(res);
            }
        } else {
            return responseManager.unauthorisedRequest(res);
        }

    } else {
        return responseManager.unauthorisedRequest(res);
    }
}
