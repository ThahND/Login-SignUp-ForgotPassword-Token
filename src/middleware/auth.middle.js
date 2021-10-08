
const jwtEnDecode = require('./token.en-decode');
const jwtConfig = require('../config/token.config');
const serviceToken = require('../services/tokens.service');


exports.isLogined = async (req, res, next) => {
    try {
        let tokenClient = req.query.token || req.header.token || req.session.token || req.headers["access-token"];
        // console.log(' --token Client: ' + tokenClient);
        let tokenServer = await serviceToken.findOneByToken(tokenClient);
        // console.log(tokenServer);
        if (tokenClient && tokenServer) {
            try {
                let decodeToken = await jwtEnDecode.decodeToken(tokenClient, jwtConfig.ACCESS_TOKEN_SECRET);
                req.jwtDecode = decodeToken;
                next();
            } catch {
                let refreshTokenClient = req.query.refreshtoken || req.header.refreshtoken || req.session.refreshtoken || req.headers["refresh-token"];
                if (refreshTokenClient && tokenServer) {
                    try {
                        let decodeRefreshToken = await jwtEnDecode.decodeToken(refreshTokenClient, jwtConfig.REFRESH_TOKEN_SECRET);
                        let _userToken = {
                            id: decodeRefreshToken.data.id,
                            v: decodeRefreshToken.data.v,
                            iss: decodeRefreshToken.data.iss,
                            iat: Date.now()
                        }
                        let token = await jwtEnDecode.encodeToken(_userToken, jwtConfig.ACCESS_TOKEN_SECRET, jwtConfig.ACCESS_TOKEN_LIFE);
                        await serviceToken.updateTokenByID(tokenServer.dataValues.id, token);
                        req.header.token = token;
                        req.jwtDecode = { data: _userToken };
                        next();
                    } catch (err) {
                        await serviceToken.deleteTokenByID(tokenServer.dataValues.id);
                        res.redirect('http://localhost:3003/login');
                    }
                }
            }
        } else {
            res.redirect('http://localhost:3003/login');
        }
    } catch {
        res.redirect('http://localhost:3003/login');
    }
}

exports.isAccess = async (req, res, next) => {
    if (req.jwtDecode.data.v == '1') next();
    else res.redirect('http://localhost:3003/list/users');
}