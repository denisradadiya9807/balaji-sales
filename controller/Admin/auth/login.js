var express = require('express');
var router = express.Router();
const helper = require('../../../utility/helper');
const constants = require('../../../utility/constants');
const responseManager = require('../../../utility/response.manager');
const mongoconnection = require('../../../utility/connection');
const adminmodel = require('../../../model/admin.model');
exports.login = async (req, res) => {
    const { email, password } = req.body;
    let primary = mongoconnection.useDb(constants.balajisales);
    let admindata = await primary.model(constants.Model.admins, adminmodel).findOne({ email: email }).lean();
    if (email && email != '' && email != null && email != undefined) {
        if (password && password != '' && password != null && password != undefined) {
            let decryptdpassword = await helper.passwordDecryptor(admindata.password)
            if (password == decryptdpassword) {
                let accessgenerate = await helper.generateAccessToken({ email: admindata.email.toString(), _id: admindata._id.toString() })
                let data = {
                    accessToken: accessgenerate
                };
                return responseManager.onSuccess('user Login Successfully...', data, res);
            } else {
                return responseManager.onBadRequest({ message: 'invalid password please enter valid password..!' }, res);
            }
        } else {
            return responseManager.onBadRequest({ message: 'invalid password please enter valid password...1' }, res);
        }
    } else {
        return responseManager.onBadRequest({ message: 'invalid Email please enter valid Email .....!' }, res);
    }
}

