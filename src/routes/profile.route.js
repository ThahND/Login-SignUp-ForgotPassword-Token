const express = require('express');
const router = express.Router();
const controller = require('../controllers/profile.controller');
const uploadPicture = require('../upload/pictures.upload').upload;
const isLogined = require('../middleware/auth.middle').isLogined;


router.get('/', isLogined, controller.getProfile);

router.post('/', isLogined, uploadPicture.single('avatarProfile'), controller.postProfile);

router.post('/change-password', isLogined, controller.postChangePassword);


module.exports = router;