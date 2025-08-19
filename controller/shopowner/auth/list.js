const express = require('express');
const router = express.Router();
const constant = require('../../../utility/constants');
const mongoConnection = require('../../../utility/connection');
const config = require('../../../utility/config');
const user = require('../../../model/auth.model');
const mongoose = require('mongoose');
const responseManager = require('../../../utility/response.manager');
exports.list = async (req, res) => {
    const { search } = req.body;
    const primary = mongoConnection.useDb(constant.balajisales);
    let leaddata = await primary.model(constant.Model.userregisters, user).find({ Shop_Name: { '$regex': new RegExp(search, "i") }, }).lean();
    return responseManager.onSuccess('lead list...', leaddata, res);
}

