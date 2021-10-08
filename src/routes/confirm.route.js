
const express = require('express');
const router = express.Router();
const controller = require('../controllers/confirm.controller');


router.get('/', controller.getPageConfirm);

router.post('/', controller.postConfirm);

module.exports = router;