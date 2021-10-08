
const serviceUsers = require('../services/users.service');
const serviceTokens = require('../services/tokens.service');
const serviceAccounttypes = require('../services/accountypes.service');
const { changePasswordValidation } = require('../middleware/change-password.validation');


exports.getProfile = async (req, res) => {
    let data = await _getDataUser(req.session.user.id, 200, 'OK', null, null);

    return res.render('Shared/_Layout', { linkPage: 'profile/index', data: data, user: req.session.user });
    // return res.status(200).json({ status: 200, message: '' });
}

exports.postProfile = async (req, res) => {
    try {
        let dataUser = {};
        if (req.file) {
            dataUser = {
                firstname: req.body.firstname ? req.body.firstname : null,
                lastname: req.body.lastname ? req.body.lastname : null,
                tel: req.body.tel ? req.body.tel : null,
                address: req.body.address ? req.body.address : null,
                avatar: req.file.filename
            }
            req.session.user.avatar = req.file.filename;
        } else {
            dataUser = {
                firstname: req.body.firstname ? req.body.firstname : null,
                lastname: req.body.lastname ? req.body.lastname : null,
                tel: req.body.tel ? req.body.tel : null,
                address: req.body.address ? req.body.address : null
            }
        }
        await serviceUsers.updateOneByID(req.session.user.id, dataUser);
        // console.log(result[0]); // result[0] = 1
        let data = await _getDataUser(req.session.user.id, 200, 'OK', 'Đã lưu thông tin!.', null);
        return res.render('Shared/_Layout', { linkPage: 'profile/index', data: data, user: req.session.user });
    } catch (e) {
        return res.status(500).json({ status: 500, message: 'Máy chủ gặp sự cố!', error: e });
    }
}

exports.getChangePassword = async (req, res, next) => {
    return res.redirect('http://localhost:3003/profile');
}

exports.postChangePassword = async (req, res, next) => {
    try {
        console.log(req.body);
        let checkValidation = await changePasswordValidation(req.body);
        if (checkValidation.error) {
            let data = await _getDataUser(req.session.user.id, 401, 'Unauthorized', null, 'Mật khẩu không hợp lệ!.');
            return res.render('Shared/_Layout', { linkPage: 'profile/index', data: data, user: req.session.user });
        }

        let result = await serviceUsers.findOneByID(req.session.user.id);
        if (result.dataValues.password == req.body.oldPassword) {
            if (req.body.newPassword == req.body.repeatPassword) {
                if (result.dataValues.password == req.body.newPassword) {
                    let data = await _getDataUser(req.session.user.id, 401, 'Unauthorized', null, 'Mật khẩu mới phải khác mật khẩu cũ!.');
                    return res.render('Shared/_Layout', { linkPage: 'profile/index', data: data, user: req.session.user });
                } else {
                    let dataUser = { password: req.body.newPassword }
                    serviceTokens.deleteAllByIDUser(req.session.user.id, req.session.user.tid);
                    await serviceUsers.updateOneByID(req.session.user.id, dataUser);

                    let data = await _getDataUser(req.session.user.id, 200, 'OK', null, 'Đổi mật khẩu thành công!.');
                    return res.render('Shared/_Layout', { linkPage: 'profile/index', data: data, user: req.session.user });
                }
            } else {
                let data = await _getDataUser(req.session.user.id, 401, 'Unauthorized', null, 'Mật khẩu mới không giống nhau!.');
                return res.render('Shared/_Layout', { linkPage: 'profile/index', data: data, user: req.session.user });
            }
        } else {
            let data = await _getDataUser(req.session.user.id, 401, 'Unauthorized', null, 'Mật khẩu cũ không đúng!.');
            return res.render('Shared/_Layout', { linkPage: 'profile/index', data: data, user: req.session.user });
        }
    } catch {
        return res.redirect('http://localhost:3003/profile');
    }
}


async function _getDataUser(_idUser, statusCode, statusMessage, messageProfileString, messageChangePasswordString) {
    let result = await serviceUsers.findOneByID(_idUser);
    let resultAccType = await serviceAccounttypes.findOneByID(result.dataValues.accounttype);
    delete result.dataValues['password'];
    result.dataValues.accounttype = resultAccType.dataValues.name;
    let data = {
        status: statusCode,
        statusMessage: statusMessage || null,
        messageProfile: messageProfileString || null,
        messageChange: messageChangePasswordString || null,
        data: result.dataValues
    }
    return data;
}