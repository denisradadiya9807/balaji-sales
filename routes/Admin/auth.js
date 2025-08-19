let express = require('express');
let router = express.Router();
const helper = require('../../utility/helper');
const loginctrl = require('../../controller/Admin/auth/login');
router.post('/login', helper.authenticateToken, loginctrl.login);
module.exports = router;
