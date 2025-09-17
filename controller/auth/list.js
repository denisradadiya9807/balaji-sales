const express = require('express');
const router = express.Router();
const constant = require('../../utility/constants');
const mongoConnection = require('../../utility/connection');
const config = require('../../utility/config');
const user = require('../../model/auth.model');
const mongoose = require('mongoose');
const responseManager = require('../../utility/response.manager');
exports.list = async (req, res) => {
    const { search } = req.body;
    if (req.token && mongoose.Types.ObjectId.isValid(req.token._id)) {
        const primary = mongoConnection.useDb(constant.balajisales);
        let admindata
        let leaddata = await primary.model(constant.Model.userregisters, user).find({ Shop_Name: { '$regex': new RegExp(search, "i") }, }).lean();

        let customdata = leaddata.map(iteam => ({
            Email: iteam.Email,
            Shop_Name: iteam.Shop_Name,
            Shop_Owner_Name: iteam.Shop_Owner_Name,
            Mobile_Number: iteam.Mobile_Number,
            Alternate_Mobile_Number: iteam.Alternate_Mobile_Number,
            Address: iteam.Address
        }));
        return responseManager.onSuccess('lead list...', customdata, res);
    } else {
        return responseManager.unauthorisedRequest(res);
    }
}
