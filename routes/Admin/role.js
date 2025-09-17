var express = require('express');
var router = express.Router();
const helper = require('../../utility/helper');
const saveCtrl = require('../../controller/Admin/role/save');
const getpermissionCtrl = require('../../controller/Admin/role/getpermission');
const rolelistctrl = require('../../controller/Admin/role/list');
const withpagination = require('../../controller/Admin/role/list');
const roleassignctrl = require('../../controller/Admin/role/assign');

router.post('/save', helper.authenticateToken, saveCtrl.save);
router.post('/roleassign', helper.authenticateToken, roleassignctrl.roleassign);
router.get('/getpermission', getpermissionCtrl.getpermission);
router.get('/rolelist', helper.authenticateToken, rolelistctrl.rolelist);
router.get('/withpagination', helper.authenticateToken, withpagination.withpagination);
module.exports = router;    