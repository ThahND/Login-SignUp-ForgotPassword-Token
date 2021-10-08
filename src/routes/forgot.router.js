
const express = require('express');
const router = express.Router();
const controller = require('../controllers/forgot-password.controller');


router.get('/', controller.getPageForgot);

router.post('/', controller.postForgot);

router.get('/change', controller.getChangePassword);

router.post('/change', controller.postChangePassword);

module.exports = router;