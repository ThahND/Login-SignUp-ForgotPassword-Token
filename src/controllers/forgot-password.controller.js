
const serviceUsers = require('../services/users.service');
const serviceSendMail = require('../services/send-mail.service');


exports.getPageForgot = async (req, res, next) => {
    return res.render('forgot/index', { status: 200, message: '' });
}

exports.postForgot = async (req, res, next) => {
    let resultDataUser = await serviceUsers.findOneByEmail(req.body.email);
    if (resultDataUser) {
        try {
            await serviceSendMail.sendMailForgotPass(req.body.email)
                .then(result => {
                    return res.status(200).json({ status: 200, message: 'Password change link has been sent to your email' });
                })
                .catch(err => {
                    return res.status(500).json({ status: 500, message: 'Lỗi! Không thể gửi mail' });
                })
        } catch (err) {
            return res.status(500).json({ status: 500, message: 'Lỗi máy chủ!', error: err });
        }
    }
    else {
        return res.render('forgot/index', { status: 400, message: 'Email không đúng hoặc không tồn tại!.' });
    }
}

exports.getChangePassword = async (req, res, next) => {
    return res.render('forgot/change', { status: 200, message: '' });
}

exports.postChangePassword = async (req, res, next) => {
    try {
        let result = await serviceSendMail.checkTokenKey(req.query.k);
        await serviceUsers.updateOneByEmail(result.data.email, { password: req.body.password })
        return res.redirect('http://localhost:3003/login');
    } catch (err) {
        return res.status(400).json({ status: 400, message: '', error: err });
    }
}