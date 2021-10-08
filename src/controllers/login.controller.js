const validation = require('../middleware/login.validation');
const serviceUser = require('../services/users.service');
const serviceTokens = require('../services/tokens.service');
const jwtConfig = require('../config/token.config');
const jwtEnDecode = require('../middleware/token.en-decode');


exports.getPageLogin = async (req, res) => {
    return res.render('login/index', { status: 200, message: '' });
    // return res.status(200).json({ status: 200, message: '' });
}

exports.postLogin = async (req, res) => {
    try {
        // console.log(req.body);
        let checkValidation = await validation.loginValidation(req.body)
        if (checkValidation.error) {
            return res.render('login/index', { status: 200, message: 'Chưa nhập tài khoản hoặc mật khẩu!' });
            // return res.status(400).json({ status: 400, message: 'Chưa nhập tài khoản hoặc mật khẩu!', error: checkValidation.error });
        }

        let checkAccount = await serviceUser.findOneByEmailPassword(req.body)
        if (!checkAccount) {
            return res.render('login/index', { status: 400, message: 'Tài khoản đăng nhập không đúng!' });
            // return res.redirect('http://localhost:3003/login');
            // return res.status(400).json({ status: 400, message: 'Tài khoản đăng nhập không đúng!' });
        } else if (!checkAccount.dataValues.actived) {
            return res.render('login/index', { status: 200, message: 'Tài khoản chưa được kích hoạt!' });
            // return res.redirect('http://localhost:3003/login');
            // return res.status(200).json({ status: 200, message: 'Tài khoản chưa được kích hoạt!' });
        } else if (checkAccount.dataValues.locked) {
            return res.render('login/index', { status: 200, message: 'Tài khoản đang bị khóa!' });
            // return res.redirect('http://localhost:3003/login');
            // return res.status(200).json({ status: 200, message: 'Tài khoản đang bị khóa!' });
        }

        let _userToken = {
            id: checkAccount.dataValues.id,
            v: checkAccount.dataValues.accounttype,
            iss: 'TDN-VED-SJ-EDON',
            iat: Date.now()
        }

        const accessToken = await jwtEnDecode.encodeToken(_userToken, jwtConfig.ACCESS_TOKEN_SECRET, jwtConfig.ACCESS_TOKEN_LIFE);
        const refreshToken = await jwtEnDecode.encodeToken(_userToken, jwtConfig.REFRESH_TOKEN_SECRET, jwtConfig.REFRESH_TOKEN_LIFE);
        let token = await serviceTokens.createToken(checkAccount.dataValues.id, accessToken, refreshToken);

        let _user = {
            tid: token.dataValues.id,
            id: checkAccount.dataValues.id,
            avatar: checkAccount.dataValues.avatar
        }
        req.session.user = _user;
        req.header.token = accessToken;
        req.header.refreshtoken = refreshToken;
        return res.redirect('http://localhost:3003/list/users');
        // return res.status(200).json({ status: 200, message: 'OK' });
    } catch (err) {
        return res.redirect('http://localhost:3003/login');
    }
}

exports.getLoginWithGG_FB = async (req, res) => {
    // console.log(req.user);
    // console.log(req.session);
    try {
        let _userToken = {
            id: req.user.id,
            v: req.user.v,
            iss: 'TDN-VED-SJ-EDON',
            iat: Date.now()
        }

        const accessToken = await jwtEnDecode.encodeToken(_userToken, jwtConfig.ACCESS_TOKEN_SECRET, jwtConfig.ACCESS_TOKEN_LIFE);
        const refreshToken = await jwtEnDecode.encodeToken(_userToken, jwtConfig.REFRESH_TOKEN_SECRET, jwtConfig.REFRESH_TOKEN_LIFE);
        let token = await serviceTokens.createToken(req.user.id, accessToken, refreshToken);

        let _user = {
            tid: token.dataValues.id,
            id: req.user.id,
            avatar: req.user.avatar
        }
        req.session.user = _user;
        req.header.token = accessToken;
        req.header.refreshtoken = refreshToken;
        return res.redirect('http://localhost:3003/list/users');
        // return res.status(200).json({ status: 200, message: 'OK' });
    } catch (err) {
        return res.redirect('http://localhost:3003/login');
        // return res.status(500).json({ status: 500, message: error });
    }
}
