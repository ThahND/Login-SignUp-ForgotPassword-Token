
const sequelize = require('sequelize');
const { Op } = require('sequelize');
const model = require('../models/users.model');


exports.findAll = async () => {
    return new Promise((resolve, reject) => {
        model.findAll()
            .then(result => { return resolve(result) })
            .catch(err => { return reject(err) })
    })
}

// { ftsAcct: [ '1', '2', '3' ], ftsLock: false, ftsActi: true }
exports.findAllWithPageNumb_Search_Filter = async (pageNumber, search_OR_filter_Json) => {
    let _limit = 10;
    let _offset = (pageNumber - 1) * _limit;
    if (search_OR_filter_Json.search) {
        return new Promise((resolve, reject) => {
            model.findAll({
                where: {
                    [Op.or]: {
                        email: { [Op.iLike]: `%${search_OR_filter_Json.search}%` },
                        firstname: { [Op.iLike]: `%${search_OR_filter_Json.search}%` },
                        lastname: { [Op.iLike]: `%${search_OR_filter_Json.search}%` }
                    }
                },
                order: ['id'], offset: _offset, limit: _limit
            })
                .then(result => { return resolve(result) })
                .catch(err => { return reject(err) })
        })
    } else if (search_OR_filter_Json.ftsAcct || search_OR_filter_Json.ftsActi || search_OR_filter_Json.ftsLock) {
        return new Promise((resolve, reject) => {
            model.findAll({
                where: {
                    [Op.and]: {
                        accounttype: typeof search_OR_filter_Json.ftsAcct === 'object' ? { [Op.in]: search_OR_filter_Json.ftsAcct } : search_OR_filter_Json.ftsAcct || { [Op.not]: null },
                        locked: typeof search_OR_filter_Json.ftsLock === 'object' ? { [Op.in]: search_OR_filter_Json.ftsLock } : search_OR_filter_Json.ftsLock || { [Op.not]: null },
                        actived: typeof search_OR_filter_Json.ftsActi === 'object' ? { [Op.in]: search_OR_filter_Json.ftsActi } : search_OR_filter_Json.ftsActi || { [Op.not]: null }
                    }
                },
                order: ['id'], offset: _offset, limit: _limit
            })
                .then(result => { return resolve(result) })
                .catch(err => { return reject(err) })
        })
    } else {
        return new Promise((resolve, reject) => {
            model.findAll({
                order: ['id'], offset: _offset, limit: _limit
            })
                .then(result => { return resolve(result) })
                .catch(err => { return reject(err) })
        })
    }
}

// { ftsAcct: [ '1', '2', '3' ], ftsLock: false, ftsActi: true }
exports.countAll_Search_Filter = async (search_OR_filter_Json) => {
    if (search_OR_filter_Json.search) {
        return new Promise((resolve, reject) => {
            model.count({
                where: {
                    [Op.or]: {
                        email: { [Op.iLike]: `%${search_OR_filter_Json.search}%` },
                        firstname: { [Op.iLike]: `%${search_OR_filter_Json.search}%` },
                        lastname: { [Op.iLike]: `%${search_OR_filter_Json.search}%` }
                    }
                }
            })
                .then(result => { return resolve(result) })
                .catch(err => { return reject(err) })
        })
    } else if (search_OR_filter_Json.ftsAcct || search_OR_filter_Json.ftsActi || search_OR_filter_Json.ftsLock) {
        return new Promise((resolve, reject) => {
            model.count({
                where: {
                    [Op.and]: {
                        accounttype: typeof search_OR_filter_Json.ftsAcct === 'object' ? { [Op.in]: search_OR_filter_Json.ftsAcct } : search_OR_filter_Json.ftsAcct || { [Op.not]: null },
                        locked: typeof search_OR_filter_Json.ftsLock === 'object' ? { [Op.in]: search_OR_filter_Json.ftsLock } : search_OR_filter_Json.ftsLock || { [Op.not]: null },
                        actived: typeof search_OR_filter_Json.ftsActi === 'object' ? { [Op.in]: search_OR_filter_Json.ftsActi } : search_OR_filter_Json.ftsActi || { [Op.not]: null }
                    }
                }
            })
                .then(result => { return resolve(result) })
                .catch(err => { return reject(err) })
        })
    } else {
        return new Promise((resolve, reject) => {
            model.count()
                .then(result => { return resolve(result) })
                .catch(err => { return reject(err) })
        })
    }
}

// SELECT accounttype, COUNT(*) FROM users GROUP BY accounttype
exports.countAccTypesUsers = async () => {
    return new Promise((resolve, reject) => {
        model.count({
            group: ['accounttype']
        })
            .then(result => { return resolve(result) })
            .catch(err => { return reject(err) })
    })
}

// SELECT locked, count(*) FROM users GROUP BY locked
exports.countLockedUsers = async () => {
    return new Promise((resolve, reject) => {
        model.count({
            group: ['locked']
        })
            .then(result => { return resolve(result) })
            .catch(err => { return reject(err) })
    })
}

// SELECT actived, count(*) FROM users GROUP BY actived
exports.countActivedUsers = async () => {
    return new Promise((resolve, reject) => {
        model.count({
            group: ['actived']
        })
            .then(result => { return resolve(result) })
            .catch(err => { return reject(err) })
    })
}

exports.findOneByEmailPassword = async (dataJson) => {
    return new Promise((resolve, reject) => {
        model.findOne({ where: dataJson })
            .then(result => { return resolve(result) })
            .catch(err => { return reject(err) })
    })
}

exports.findOneByID = async (_id) => {
    return new Promise((resolve, reject) => {
        model.findOne({ where: { id: _id } })
            .then(result => { return resolve(result) })
            .catch(err => { return reject(err) })
    })
}

exports.findOneByEmail = async (_email) => {
    return new Promise((resolve, reject) => {
        model.findOne({ where: { email: _email } })
            .then(result => { return resolve(result) })
            .catch(err => { return reject(err) })
    })
}

exports.findOneOrCreate_FB_GG = async (_id_FB_or_GG) => {
    return new Promise((resolve, reject) => {
        model.findOrCreate({
            where: { email: _id_FB_or_GG },
            defaults: {
                email: _id_FB_or_GG,
                password: '*#@045$9%zx&0',
                actived: true
            }
        })
            .then(result => { return resolve(result) })
            .catch(err => { return reject(err) })
    })

}

exports.createUser = async (dataJson) => {
    return new Promise((resolve, reject) => {
        model.create(dataJson)
            .then(result => { return resolve(result) })
            .catch(err => { return reject(err) })
    })
}

exports.updateOneByID = async (_id, dataJson) => {
    return new Promise((resolve, reject) => {
        model.update(dataJson,
            { where: { id: _id } })
            .then(result => { return resolve(result) })
            .catch(err => { return reject(err) })
    })
}

exports.updateOneByEmail = async (_email, dataJson) => {
    return new Promise((resolve, reject) => {
        model.update(dataJson,
            { where: { email: _email } })
            .then(result => { return resolve(result) })
            .catch(err => { return reject(err) })
    })
}

exports.deleteOneByID = async (_id) => {
    return new Promise((resolve, reject) => {
        model.destroy({ where: { id: _id } })
            .then(result => { return resolve(result) })
            .catch(err => { return reject(err) })
    })
}
