
const serviceToken = require('../services/tokens.service');


exports.getLogout = async (req, res) => {
    try {
        await serviceToken.deleteTokenByID(req.session.user.tid);
        req.logout();
        return res.redirect('http://localhost:3003/login');
    } catch (e) {

    }

    return res.redirect('http://localhost:3003/login');
}