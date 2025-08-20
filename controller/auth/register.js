var express = require('express');
var router = express.Router();
var constant = require('../../utility/constants');
var config = require('../../utility/config');
var mongoConnection = require('../../utility/connection');
var authmodel = require('../../model/auth.model');
var helper = require('../../utility/helper');
var responsemanager = require('../../utility/response.manager');

exports.register = async (req, res) => {
    let primary = mongoConnection.useDb(constant.balajisales);
    const { Email, Password, Shop_Name, Shop_Owner_Name, Mobile_Number, Alternate_Mobile_Number, Address, Username, Route, roleid, Status } = req.body;
    if (Email && Email != '' && Email != null && Email != undefined) {
        if (Password && Password != '' && Password != null && Password != undefined) {
            if (Shop_Name && Shop_Name != '' && Shop_Name != null && Shop_Name != undefined) {
                if (Shop_Owner_Name && Shop_Owner_Name != '' && Shop_Owner_Name != null && Shop_Owner_Name != undefined) {
                    if (Mobile_Number && Mobile_Number != '' && Mobile_Number != null && Mobile_Number != undefined) {
                        if (Username && Username != '' && Username != null && Username != undefined) {
                            let exitingdata = await primary.model(constant.Model.userregisters, authmodel).findOne({ Email: Email }).lean()
                            if (exitingdata) {
                                return responsemanager.onBadRequest({ message: " This Email Is Already Register Please Login..." }, res)
                            }
                            let ecryptpasword = await helper.passwordEncryptor(Password);
                            let obj = {
                                Email: Email,
                                Username: Username,
                                Password: ecryptpasword,
                                Shop_Name: Shop_Name,
                                Shop_Owner_Name: Shop_Owner_Name,
                                Mobile_Number: Mobile_Number,
                                Alternate_Mobile_Number: Alternate_Mobile_Number,
                                Address: Address,
                                roleid: roleid,
                                Route: Route,
                                Status: Status
                            }
                            let createdata = await primary.model(constant.Model.userregisters, authmodel).create(obj);
                            let generateAccessToken = await helper.generateAccessToken({ _id: createdata._id.toString() })
                            return responsemanager.onSuccess('You Are Register Successfully...', { token: generateAccessToken }, res);
                        } else {
                            return responsemanager.onBadRequest({ Message: 'Please Enter UserName...' }, res);
                        }
                    } else {
                        return responsemanager.onBadRequest({ Message: 'Please Enter Mobile_Number...' }, res);
                    }
                } else {
                    return responsemanager.onBadRequest({ Message: 'Please Enter Shop_Owner_Name...' }, res);
                }
            } else {
                return responsemanager.onBadRequest({ Message: 'Please Enter Shop_Name...' }, res);
            }
        } else {
            return responsemanager.onBadRequest({ Message: 'Please Enter Password...' }, res);
        }
    } else {
        return responsemanager.onBadRequest({ Message: 'Please Enter Email...' }, res);
    }

}