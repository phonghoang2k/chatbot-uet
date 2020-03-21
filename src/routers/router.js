var express = require('express');
var router = express.Router();

const facebook = require('../controllers/facebook');

router.get('/', facebook.verify);
router.post('/', facebook.postData);

module.exports = router;