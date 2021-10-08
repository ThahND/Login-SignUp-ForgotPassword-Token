
const serviceUsers = require('../services/users.service');
const serviceAccounttypes = require('../services/accountypes.service');
const validation = require('../middleware/list-users.validation');


exports.getListUsers = async (req, res, next) => {
    // try {
    // console.log(req.body);
    // console.log(req.query);
    // console.log(req.params);
    if (req.query.page) {
        if (req.query.search) {
            return res.redirect(`http://localhost:3003/list/users/page=${req.query.page}?search=${req.query.search}`);
        } else if (req.query.ftsAcct || req.query.ftsLock || req.query.ftsActi) {
            let q = await _checkAndValidationFilter(req.query);
            return res.redirect(`http://localhost:3003/list/users/page=${req.query.page}?${q}`);
        } else {
            return res.redirect(`http://localhost:3003/list/users/page=${req.query.page}`);
        }
    }

    // Lấy dữ liệu theo trang
    let result = await serviceUsers.findAllWithPageNumb_Search_Filter(req.params.page || 1, req.query);
    let resultAccounttypes = await serviceAccounttypes.findAll();
    let countAll = await serviceUsers.countAll_Search_Filter(req.query);
    let pages = countAll / 10;
    // 
    if (req.params.page > pages + 1) {
        if (req.query.search) {
            return res.redirect(`http://localhost:3003/list/users?search=${req.query.search}`);
        } else if (req.query.ftsAcct || req.query.ftsLock || req.query.ftsActi) {
            let q = await _checkAndValidationFilter(req.query);
            return res.redirect(`http://localhost:3003/list/users?${q}`);
        } else {
            return res.redirect(`http://localhost:3003/list/users`);
        }
    }

    // Cụm dữ liệu trả về view
    let data = {
        status: 200,
        message: 'Danh sách người dùng',
        current: req.params.page || 1,
        pages: pages > parseInt(pages) ? parseInt(pages) + 1 : parseInt(pages),
        search: req.query.search,
        filter: req.query.ftsAcct || req.query.ftsActi || req.query.ftsLock ? await _checkAndValidationFilter(req.query) : null,
        data: [],
        accounttypes: [],
        actived: await serviceUsers.countActivedUsers(),
        locked: await serviceUsers.countLockedUsers()
    }

    // Thêm accounttypes vào cụm
    let resultCountAccTypes = await serviceUsers.countAccTypesUsers();
    resultAccounttypes.forEach(item => {
        delete item.dataValues.createdAt;
        delete item.dataValues.updatedAt;
        item.dataValues.count = null;
        resultCountAccTypes.forEach(itCount => {
            if (item.dataValues.id === itCount.accounttype)
                item.dataValues.count = itCount.count;
        });
        data.accounttypes.push(item.dataValues);
    });

    // Thêm dữ liệu (list) vào cụm
    result.forEach(item => {
        delete item.dataValues.password;
        resultAccounttypes.forEach(itemType => {
            if (itemType.dataValues.id == item.dataValues.accounttype)
                item.dataValues.accounttype = { id: itemType.dataValues.id, name: itemType.dataValues.name };
        });
        data.data.push(item.dataValues);
    });
    // console.log(data);
    return res.render('Shared/_Layout', { linkPage: 'list/users/index', data: data, user: req.session.user });
    // } catch (e) {
    //     return res.status(404).json({ status: 404, message: 'Không tìm thấy trang yêu cầu!', error: e });
    // }
}

exports.postListUser_CreateUser = async (req, res, next) => {
    let resultValidation = validation.createValidation(req.body);
    if (resultValidation.error) {
        return res.redirect('http://localhost:3003/list/users');
    }
    let data = {
        email: req.body.email,
        password: req.body.password,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        accounttype: req.body.accounttype,
        locked: false,
        actived: true
    };
    await serviceUsers.createUser(data)
        .then(result => { return res.redirect('http://localhost:3003/list/users'); })
        .catch(err => { return res.status(500).json({ status: 500, message: 'Máy chủ gặp sự cố!.', error: err }) })
}

// exports.getCreateUser = async (req, res, next) => {
//     return res.render('Shared/_Layout', { linkPage: 'list/users/create', data: null, user: req.session.user || req.user });
// }

// exports.postCreateUser = async (req, res, next) => {
//     return res.render('Shared/_Layout', { linkPage: 'list/users/create', data: null, user: req.session.user || req.user });
// }

exports.getEditUser = async (req, res, next) => {
    try {
        let result = await serviceUsers.findOneByID(req.params.id);
        let resultAccType = await serviceAccounttypes.findOneByID(result.dataValues.accounttype);
        delete result.dataValues.password;
        result.dataValues.accounttype = resultAccType.dataValues.name;
        let data = {
            status: 200,
            message: '',
            data: result
        }
        return res.render('Shared/_Layout', { linkPage: 'list/users/edit', data: data, user: req.session.user });
    } catch (e) {
        return res.status(404).json({ status: 404, message: 'Không tìm thấy trang yêu cầu!', error: e });
    }
}

exports.postEditUser = async (req, res, next) => {
    // console.log(req.body);
    // console.log(req.file);
    try {
        let data = {};
        if (req.file) {
            data = {
                firstname: req.body.firstname ? req.body.firstname : null,
                lastname: req.body.lastname ? req.body.lastname : null,
                tel: req.body.tel ? req.body.tel : null,
                address: req.body.address ? req.body.address : null,
                avatar: req.file.filename
            }
        } else {
            data = {
                firstname: req.body.firstname ? req.body.firstname : null,
                lastname: req.body.lastname ? req.body.lastname : null,
                tel: req.body.tel ? req.body.tel : null,
                address: req.body.address ? req.body.address : null
            }
        }
        await serviceUsers.updateOneByID(req.params.id, data)
            .then(result => {
                // console.log(result[0]); // result[0] = 1
                return res.redirect(`http://localhost:3003/list/users/edit/${req.params.id}`);
            })
            .catch(err => { return res.status(500).json({ status: 500, message: 'Máy chủ gặp sự cố!', error: e }); })
    } catch (e) {
        return res.status(500).json({ status: 500, message: 'Máy chủ gặp sự cố!', error: e });
    }
}

exports.getDeleteUser = async (req, res, next) => {
    // if (req.params.id == req.body.id) {

    // }
    await serviceUsers.deleteOneByID(req.params.id)
        .then(result => { return res.redirect('http://localhost:3003/list/users') })
        .catch(err => { return res.status(500).json({ status: 500, message: 'Máy chủ gặp sự cố!', error: err }); })
}

exports.getLocked = async (req, res, next) => {
    await serviceUsers.findOneByID(req.params.id)
        .then(result => {
            serviceUsers.updateOneByID(req.params.id, { locked: !result.dataValues.locked })
                .then(result => { return res.redirect('http://localhost:3003/list/users') })
        })
        .catch(err => { return res.status(400).json({ status: 400, message: 'Lỗi!.', error: err }) })
}


async function _checkAndValidationFilter(filterJson) {
    let q = '';
    if (filterJson.ftsAcct) {
        if (typeof filterJson.ftsAcct === 'object') {
            (filterJson.ftsAcct).forEach(item => {
                q += `ftsAcct=${item}&`;
            });
        } else if (typeof filterJson.ftsAcct === 'string') {
            q += `ftsAcct=${filterJson.ftsAcct}&`;
        }
    }
    if (filterJson.ftsLock) {
        if (typeof filterJson.ftsLock === 'object') {
            (filterJson.ftsLock).forEach(item => {
                q += `ftsLock=${item}&`;
            });
        } else if (typeof filterJson.ftsLock === 'string') {
            q += `ftsLock=${filterJson.ftsLock}&`;
        }
    }
    if (filterJson.ftsActi) {
        if (typeof filterJson.ftsActi === 'object') {
            (filterJson.ftsActi).forEach(item => {
                q += `ftsActi=${item}&`;
            });
        } else if (typeof filterJson.ftsActi === 'string') {
            q += `ftsActi=${filterJson.ftsActi}&`;
        }
    }
    q = q.slice(0, -1);
    return q;
}