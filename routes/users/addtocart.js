const express = require('express');
const router = express.Router();
let cartctrl = require('../../controller/users/addtocart/save');
let cartlistctrl = require('../../controller/users/addtocart/list');
let cartdeletectrl = require('../../controller/users/addtocart/delete');
let helper = require('../../utility/helper');

router.post('/delete', helper.authenticateToken, cartdeletectrl.delete);
router.get('/list', helper.authenticateToken, cartlistctrl.list);
router.post('/save', helper.authenticateToken, cartctrl.save);
module.exports = router;