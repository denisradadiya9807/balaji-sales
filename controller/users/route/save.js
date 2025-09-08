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
    const { route_name, gadi_number, driver_name, driver_number, driver_alternet_number, routeid, area } = req.body;
    if (req.token && mongoose.Types.ObjectId.isValid(req.token._id)) {
        let primary = mongoconnection.useDb(constants.balajisales);
        let authdata = await primary.model(constants.Model.userregisters, registermodel).findById(req.token._id);
        if (authdata && authdata.Status === true) {
            let getpermission = await config.getadminPermission(authdata.roleid, 'routes', 'InsertUpdate')
            if (getpermission) {
                if (area && area != '' && area && area != null && area && area != undefined) {
                    const cleanRouteName = route_name ? route_name.trim() : '';
                    if (routeid && mongoose.Types.ObjectId.isValid(routeid)) {

                        let checkExist = await primary.model(constants.Model.routes, routemodel).findOne({
                            _id: { $ne: routeid }, // exclude current route
                            route_name: new RegExp(`^${cleanRouteName}$`, "i") // case-insensitive
                        }).lean();
                        if (checkExist) {
                            return responsemanager.onBadRequest({ message: 'Route Name Already Exists' }, res);
                        }

                        let obj = {
                            area: area,
                            route_name: cleanRouteName,
                            gadi_number: gadi_number,
                            driver_name: driver_name,
                            driver_number: driver_number,
                            driver_alternet_number: driver_alternet_number
                        };
                        // await primary.model(constants.Model.routes, routemodel).findByIdAndUpdate(routeid, obj, { new: true }).lean();
                        let updateroute = await primary.model(constants.Model.routes, routemodel).findByIdAndUpdate(routeid, obj, { new: true }).lean();
                        return responsemanager.onSuccess('Routes Updated SuccessFully', updateroute, res);

                    } else {
                        let checkExist = await primary.model(constants.Model.routes, routemodel).findOne({
                            route_name: cleanRouteName
                        }).lean();
                        if (checkExist) {
                            let obj = {
                                area: area,
                                route_name: cleanRouteName,
                                gadi_number: gadi_number,
                                driver_name: driver_name,
                                driver_number: driver_number,
                                driver_alternet_number: driver_alternet_number
                            };
                            let newroute = await primary.model(constants.Model.routes, routemodel).create(obj);
                            return responsemanager.onSuccess('Route Created Successfully', newroute, res);
                        } else {
                            responsemanager.onBadRequest({ message: 'This Routes Already Exits' }, res);
                        }
                    }
                } else {
                    return responsemanager.onBadRequest({ message: 'Area Is not Selected' }, res);
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



