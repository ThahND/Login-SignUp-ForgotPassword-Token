
const { Op } = require('sequelize');
const model = require('../models/token.model');


exports.findOneByToken = async (_token) => {
    return new Promise((resolve, reject) => {
        model.findOne({ where: { token: _token } })
            .then(result => { return resolve(result) })
            .catch(err => { return reject(err) })
    })
}

exports.findOneByRefreshToken = async (_refreshToken) => {
    return new Promise((resolve, reject) => {
        model.findOne({ where: { refreshtoken: _refreshToken } })
            .then(result => { return resolve(result) })
            .catch(err => { return reject(err) })
    })
}

exports.createToken = async (_idUser, _accessToken, _refreshToken) => {
    return new Promise((resolve, reject) => {
        model.create({
            idUser: _idUser,
            token: _accessToken,
            refreshtoken: _refreshToken
        })
            .then(result => { return resolve(result) })
            .catch(err => { return reject(err) })
    })
}

exports.updateTokenByID = async (_id, _token) => {
    return new Promise((resolve, reject) => {
        model.update({
            token: _token
        }, {
            where: { id: _id }
        })
            .then(result => { return resolve(result) })
            .catch(err => { return reject(err) })
    })
}

exports.deleteTokenByID = async (_id) => {
    return new Promise((resolve, reject) => {
        model.destroy({ where: { id: _id } })
            .then(result => { return resolve(result) })
            .catch(err => { return reject(err) })
    })
}

// DELETE FROM tokens WHERE "idUser" = 1 and id != 1
exports.deleteAllByIDUser = async (_idUser, _idToken) => {
    return new Promise((resolve, reject) => {
        model.destroy({ where: { idUser: _idUser, id: { [Op.ne]: _idToken } } })
            .then(result => { return resolve(result) })
            .catch(err => { return reject(err) })
    })
}
