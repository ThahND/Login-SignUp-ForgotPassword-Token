const express = require('express');
const router = express.Router();
const controller = require('../controllers/signup.controller');


router.get('/', controller.getPageSignup);

router.post('/', controller.postSignup);


module.exports = router;