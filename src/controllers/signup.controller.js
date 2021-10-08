
const validation = require('../middleware/signup.validation');
const serviceUsers = require('../services/users.service');
const serviceSendMail = require('../services/send-mail.service');


exports.getPageSignup = async (req, res) => {
    return res.render('signup/index', { status: 200, message: '' });
    // return res.status(200).json({ status: 200, message: '' });
}

exports.postSignup = async (req, res) => {
    let resultDataUser = await serviceUsers.findOneByEmail(req.body.email);
    if(resultDataUser){
        return res.render('signup/index', { status: 200, message: 'Tài khoản đã tồn tại!.' });
    }
    let data = {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        password: req.body.password
    }
    await serviceUsers.createUser(data)
        .then(result => {
            serviceSendMail.sendMailConfirm(req.body.email)
                .then(result => {
                    // console.log(result); // result => {cb: true}
                    return res.status(200).json({ status: 200, message: 'Go to email and confirm your account!' });
                })
                .catch(err => {
                    return res.status(500).json({ status: 500, message: 'Lỗi máy chủ!. Không thể gửi mail.', error: err });
                })
        })
        .catch(err => { return res.status(500).json({ status: 500, message: 'Lỗi máy chủ!. Tạo tài khoản thất bại.', error: err }); })
}