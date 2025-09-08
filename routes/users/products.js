let express = require('express');
let router = express.Router();
let helper = require('../../utility/helper');
let productsavectrl = require('../../controller/users/products/addcategory');
let productsavectrl1 = require('../../controller/users/products/save');
let listctrl = require('../../controller/users/products/list');
let reorderlistctrl = require('../../controller/users/products/list');
let listctrlc = require('../../controller/users/products/listcategory');
let deletectrl = require('../../controller/users/products/delete');
const uploadctrl = require('../../controller/users/products/upload');
const { upload } = require('../../utility/cloudinary'); // your multer instance

router.post("/upload", helper.authenticateToken, upload.array("images", 5), uploadctrl.upload);
// router.post('/upload', helper.authenticateToken, multer.memoryUpload.any(), uploadctrl.upload);
router.post('/addcategory', helper.authenticateToken, productsavectrl.addcategory);
router.post('/save', helper.authenticateToken, productsavectrl1.save);
router.post('/delete', helper.authenticateToken, deletectrl.delete);
router.get('/categorylist', helper.authenticateToken, listctrlc.list);
router.get('/list', helper.authenticateToken, listctrl.list);
router.get('/reorderlist', helper.authenticateToken, reorderlistctrl.reorderlist);
// router.get('/withpagination', helper.authenticateToken, listctrl.withpagination);
module.exports = router;


