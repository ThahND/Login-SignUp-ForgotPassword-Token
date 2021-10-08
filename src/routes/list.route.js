const express = require('express');
const router = express.Router();
const controller = require('../controllers/list.controller');
const uploadPicture = require('../upload/pictures.upload').upload;
const { isLogined, isAccess } = require('../middleware/auth.middle');


router.get('/users', isLogined, controller.getListUsers);

router.post('/users', isLogined, isAccess, controller.postListUser_CreateUser);

router.get('/users/page=:page', isLogined, controller.getListUsers);

// router.get('/users/create', isLogined, controller.getCreateUser);

// router.post('/users/create', isLogined, controller.postCreateUser);

router.get('/users/edit/:id', isLogined, controller.getEditUser);

router.post('/users/edit/:id', isLogined, isAccess, uploadPicture.single('avatarProfile'), controller.postEditUser);

router.get('/users/delete/:id', isLogined, isAccess, controller.getDeleteUser);

router.get('/users/locked/:id', isLogined, isAccess, controller.getLocked);


module.exports = router;