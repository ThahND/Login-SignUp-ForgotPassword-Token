const express = require('express');
const router = express.Router();
const passport = require('passport');
const controller = require('../controllers/login.controller');
const passportController = require('../controllers/passport.controller');
passportController(passport);


router.get('/', controller.getPageLogin);

router.post('/', controller.postLogin);

router.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email'] }));

router.get('/auth/facebook/callback',
    passport.authenticate('facebook'),
    controller.getLoginWithGG_FB
);

router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/auth/google/callback',
    passport.authenticate('google'),
    controller.getLoginWithGG_FB
);


module.exports = router;