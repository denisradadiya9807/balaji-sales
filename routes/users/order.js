let express = require('express');
const router = express.Router();

const helper = require('../../utility/helper');
let orderctrl = require('../../controller/users/order/placeorder');

router.post('/orderplace', helper.authenticateToken, orderctrl.orderplace);
module.exports = router;