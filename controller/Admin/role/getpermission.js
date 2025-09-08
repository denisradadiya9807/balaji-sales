const express = require('express');
const router = express.Router();
const async = require('async');
const mongoose = require('mongoose');
const adminmodel = require('../../../model/admin.model');
const constant = require('../../../utility/constants');
const config = require('../../../utility/config');
const mongoconnection = require('../../../utility/connection');
const rolemodel = require('../../../model/role.model');
const responsemanager = require('../../../utility/response.manager');
// const { Collection } = require('mongoose');

exports.getpermission = async (req, res) => {
    let finalpermission = [];
    async.forEach(config.getadmincollection, (Permissions, next_permission) => {
        let obj = {
            displayname: Permissions.text,  
            collectionname: Permissions.value,
            insertupdate: false,
            Delete: false,
            View: false
        };

        finalpermission.push(obj);
        next_permission();

    }, () => {
        res.status(200).json({
            message: 'final permission :!',
            data: finalpermission
        });
    })
};