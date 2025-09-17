const mongoConnection = require('../utility/connection');
const constants = require("../utility/constants");
// const roleModel = require('../models/role.model');
const superroleModel = require('../model/role.model');
const mongoose = require('mongoose');
const _ = require('lodash');

let getadmincollection = [
    { text: 'MainAdmin', value: 'MainAdmin' },
    { text: 'admin', value: 'admin' },
    { text: 'role', value: 'role' },
    { text: 'users', value: 'users' },
    { text: 'products', value: 'products' },
    { text: 'routes', value: 'routes' },


]
// let getsuperadmincollection = [
//     { text: 'auth', value: 'auth' },
//     { text: 'role', value: 'role' },
// ]
async function getadminPermission(roleid, modelName, permissionType) {
    let primary = mongoConnection.useDb(constants.balajisales);
    let result = await primary.model(constants.Model.roles, superroleModel).findById(roleid).lean();
    // console.log("==>", result);
    if (result && result.status && result.status == true) {
        let finalpermission = [];
        finalpermission = _.filter(result.permissions, { 'collectionname': modelName });
        // console.log("collection name->", finalpermission);
        if (finalpermission.length == 1) {
            if (permissionType == "View") {
                if (finalpermission[0].View == true)
                    return true;
                else
                    return false;
            }
            if (permissionType == "InsertUpdate") {
                if (finalpermission[0].insertupdate == true)
                    return true;
                else
                    return false;
            }
            if (permissionType == "Delete") {
                if (finalpermission[0].Delete == true)
                    return true;
                else
                    return false;
            }
            return false;
        } else {
            return false;
        }
    } else {
        return false;
    }
};
// async function getsuperadminPermission(req, roleid, modelName, permissionType) {
//     // const { database } = req.body;
//     const db = mongoConnection.useDb(req.token.database);
//     // console.log('111', req.token.database);  
//     let result = await db.model(constants.Model.role, superroleModel).findById(roleid).lean();
//     // let result = await db.collection('roles').findOne({ _id: new mongoose.Types.ObjectId(roleid) }, { projection: { _id: 0, roleid: 1 } });
//     // console.log('222', result);
//     if (result && result.status && result.status == true) {
//         let finalpermission = [];
//         finalpermission = _.filter(result.permissions, { 'collectionname': modelName });
//         // console.log('Permissions:', result.permissions);
//         if (finalpermission.length == 1) {
//             if (permissionType == "View") {
//                 if (finalpermission[0].View == true)
//                     return true;
//                 else
//                     return false;
//             }
//             if (permissionType == "insertupdate") {
//                 if (finalpermission[0].insertupdate == true)
//                     return true;
//                 else
//                     return false;
//             }
//             if (permissionType == "Delete") {
//                 if (finalpermission[0].Delete == true)
//                     return true;
//                 else
//                     return false;
//             }
//             return false;
//         } else {
//             return false;
//         }
//     } else {
//         return false;
//     }
// };
module.exports = { getadmincollection, getadminPermission };