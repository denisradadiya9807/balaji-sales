const express = require('express');
const router = express.Router();
const helper = require('../../../utility/helper');
const constants = require('../../../utility/constants');
const mongoconnection = require('../../../utility/connection');
const config = require('../../../utility/config');
const mongoose = require('mongoose');
const registermodel = require('../../../model/auth.model');
const responsemanager = require('../../../utility/response.manager');
const routemodel = require('../../../model/route.model');

exports.save = async (req, res) => {
    const { route_name, gadi_number, driver_name, driver_number, driver_alternet_number, routeid } = req.body;
    if (req.token && mongoose.Types.ObjectId.isValid(req.token._id)) {
        let primary = mongoconnection.useDb(constants.balajisales);
        let authdata = await primary.model(constants.Model.userregisters, registermodel).findById(req.token._id);
        if (authdata && authdata.Status === true) {
            let getpermission = await config.getadminPermission(authdata.roleid, 'users', 'InsertUpdate')
            if (getpermission) {
                let exits = await primary.model(constants.Model.routes, routemodel).findOneAndUpdate({ route_name: route_name }).lean();
                if (exits) {
                    return responsemanager.onBadRequest({ message: "This Route Name Is already Registers" }, res);
                }
                let obj = {
                    route_name: route_name,
                    gadi_number: gadi_number,
                    driver_name: driver_name,
                    driver_number: driver_number,
                    driver_alternet_number: driver_alternet_number
                }
                if (routeid) {
                    let updateroute = await primary.model(constants.Model.routes, routemodel).findOneAndUpdate({ _id: new mongoose.Types.ObjectId(routeid) }).lean();
                    if (updateroute) {
                        return responsemanager.onSuccess('Route Update Successfully...', updateroute, res);
                    }
                    return responsemanager.onBadRequest({ message: "Routeid Not Found..." }, res);
                } else {
                    let createuser = await primary.model(constants.Model.routes, routemodel).create(obj);
                    return responsemanager.onSuccess('Router Created Successfully', createuser, res);
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

