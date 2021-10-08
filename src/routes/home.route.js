const express = require('express');
const router = express.Router();
const controller = require('../controllers/home.controller');


router.get('/', (req, res) => {
    return res.redirect('http://localhost:3003/home');
})

router.get('/home', controller.getHome)


module.exports = router;