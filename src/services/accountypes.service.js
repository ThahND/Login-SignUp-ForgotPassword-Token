
const model = require('../models/accountypes.model');


model.findOrCreate({ where: { id: 1 }, defaults: { id: 1, name: 'Owner' } })
model.findOrCreate({ where: { id: 2 }, defaults: { id: 2, name: 'Admin' } })
model.findOrCreate({ where: { id: 3 }, defaults: { id: 3, name: 'Member' } })
model.findOrCreate({ where: { id: 4 }, defaults: { id: 4, name: 'Guest' } })
model.findOrCreate({ where: { id: 5 }, defaults: { id: 5, name: 'Invited' } })

exports.findAll = async () => {
    return new Promise((resolve, reject) => {
        model.findAll({ order: ['id'] })
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