const express = require('express');
const router = express.Router();
let cartctrl = require('../../controller/users/addtocart/save');
let helper = require('../../utility/helper');

router.post('/save', helper.authenticateToken, cartctrl.save);