var express = require('express');
var router = express.Router();

const testFunc = require('../controllers/testFunc');
const main_controler = require('../controllers/main_controller');

router.get('/', main_controler.verify);
router.post('/', main_controler.postData);

module.exports = router;