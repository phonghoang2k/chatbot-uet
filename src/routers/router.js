var express = require('express');
var router = express.Router();

const testFunc = require('../controllers/testFunc');

router.get('/', testFunc.verify);
router.post('/', testFunc.postData);

module.exports = router;