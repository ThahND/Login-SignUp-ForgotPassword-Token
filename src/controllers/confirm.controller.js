
const serviceUsers = require('../services/users.service');
const serviceMail = require('../services/send-mail.service');


exports.getPageConfirm = async (req, res) => {
    return res.render('confirm/index', { status: 200, message: 'Nhấn "Confirm" để kích hoạt tài khoản!.' });
    // return res.status(200).json({ status: 200, message: '' });
}

exports.postConfirm = async (req, res, next) => {
    try {
        let result = await serviceMail.checkTokenKey(req.query.k);
        await serviceUsers.updateOneByEmail(result.data.email, { actived: true })
        return res.redirect('http://localhost:3003/login');
    } catch (err) {
        return res.status(400).json({ status: 400, message: '', error: err });
    }
}