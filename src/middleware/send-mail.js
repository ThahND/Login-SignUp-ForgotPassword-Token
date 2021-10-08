
const nodemailer = require("nodemailer");
const jwtEnDecode = require('../middleware/token.en-decode');
const TOKEN_LIFE_CONFIRM = '365d';
const TOKEN_LIFE_CHANGE_PASSWORD = '10m';
const TOKEN_SECRET_KEY = 'token-secret-mail-dev-ndt';


exports.sendMailConfirm = async (_email) => {
    let smtpTransport = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        post: 465,
        secure: true,
        service: "gmail",
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASS_EMAIL
        }
    });
    let _userToken = {
        email: _email,
        iss: 'tdn-ved-sj-edon',
        iat: Date.now()
    }
    let token = jwtEnDecode.encodeToken(_userToken, TOKEN_SECRET_KEY, TOKEN_LIFE_CONFIRM);
    let link = `http://localhost:3003/confirm?k=${token}`;
    let mailOptions = {
        from: `TJS <${process.env.EMAIL}>`,
        to: _email,
        subject: 'Please confirm your account!',
        html: `Hello,<br> Please Click on the link to verify your email.<br><a href="${link}">Click here to verify</a>`
    };
    return new Promise((resolve, reject) => {
        smtpTransport.sendMail(mailOptions, (err, res) => {
            if (err) {
                console.log('-Error sendMailConfirm');
                return reject({ cb: null });
            } else {
                console.log(`Message sent to: ${_email} - SUCCESS`);
                return resolve({ cb: true });
            }
        })
    })
}

exports.sendMailForgotPass = async (_email) => {
    let smtpTransport = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        post: 465,
        secure: true,
        service: "gmail",
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASS_EMAIL
        }
    });
    let _userToken = {
        email: _email,
        // standard fields
        iss: 'tdn-ved-sj-edon',
        iat: Date.now()
    }
    let token = await jwtEnDecode.encodeToken(_userToken, tokenSecret, tokenLife);
    let link = `http://localhost:3001/forgot-password/change?k=${token}`;
    let mailOptions = {
        from: `TJS <${process.env.EMAIL}>`,
        to: _email,
        subject: 'Forgot Password',
        html: `Hello,<br> Your account has just requested a password change.<br> Valid time 10 minutes.<br><a href="${link}">Click here to change your password</a>`
    };

    return new Promise((resolve, reject) => {
        smtpTransport.sendMail(mailOptions, (error, res) => {
            if (error) {
                console.log('-Error sendMailForgotPass');
                return reject({ cb: null });
            } else {
                console.log('Message (forgot password) sent to: ' + _email);
                return resolve({ cb: true });
            }
        })
    })
}

exports.checkTokenKey = async (req, res, next) => {
    return new Promise((resolve, reject) => {
        if ((req.protocol + "://" + req.get('Host')) == ("http://" + req.get('Host'))) {
            try {
                let decode = jwtEnDecode.decodeToken(req.query.k, TOKEN_SECRET_KEY);
                if (decode) {
                    return resolve(decode);
                }
            } catch {
                return reject(false);
            }
        }
    })
}
