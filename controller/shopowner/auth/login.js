const express = require('express');
const router = express.Router();
const registermodel = require('../../../model/auth.model');
const mongoConnection = require('../../../utility/connection');
const helper = require('../../../utility/helper');
const constant = require('../../../utility/constants');
const responseManager = require('../../../utility/response.manager')
exports.login = async (req, res) => {
    const { Email, Password } = req.body;
    let primary = mongoConnection.useDb(constant.balajisales);
    let userdata = await primary.model(constant.Model.userregisters, registermodel).findOne({ Email: Email }).lean();
    if (userdata === null) {
        return responseManager.onBadRequest({ message: 'This Email Is Not Found Please Register...' }, res);
    }
    const ispasswordvalid = await helper.passwordDecryptor(userdata.Password);
    if (Password == ispasswordvalid) {
        let generateAccessToken = await helper.generateAccessToken({ adminid: userdata._id.toString() })
        return responseManager.onSuccess('Login Successfully..', generateAccessToken, res);
    } else {
        return responseManager.onBadRequest({ message: 'Invalid Password Please Enter Valid Password...' }, res);
    }

}

