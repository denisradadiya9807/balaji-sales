var express = require('express');
var router = express.Router();
const helper = require('../../utility/helper');
const saveCtrl = require('../../controller/shopowner/auth/register');
const loginCtrl = require('../../controller/shopowner/auth/login');
const resetpass = require('../../controller/shopowner/auth/resetpassword');
const verifuotp = require('../../controller/shopowner/auth/resetpassword');
const setpassword = require('../../controller/shopowner/auth/resetpassword');
const list = require('../../controller/shopowner/auth/list');

router.post('/setpassword', setpassword.setpassword);
router.post('/list', list.list);
router.post('/reset', resetpass.reset);
router.post('/verifyotp', verifuotp.verifyotp);
router.post('/login', loginCtrl.login);
router.post('/save', saveCtrl.register);
module.exports = router;