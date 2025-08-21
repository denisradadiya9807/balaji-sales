let express = require('express');
let router = express.Router();
let helper = require('../../utility/helper');
let routectrl = require('../../controller/users/route/save');
let listctrl = require('../../controller/users/route/list');
let deletectrl = require('../../controller/users/route/delete');

router.post('/delete', helper.authenticateToken, deletectrl.delete);
router.post('/save', helper.authenticateToken, routectrl.save);
router.get('/list', helper.authenticateToken, listctrl.list);
router.get('/withpagination', helper.authenticateToken, listctrl.withpagination);

module.exports = router;