
const sequelize = require('sequelize');
const config = require('../config/db.config');
const db = new sequelize(config.connectObj);


const tokensTable = db.define('tokens', {
    id: { type: sequelize.BIGINT, primaryKey: true, autoIncrement: true },
    idUser: sequelize.BIGINT,
    token: sequelize.STRING,
    refreshtoken: sequelize.STRING,
});

//Create table
db.sync()
    .then(() => console.log('-Table "tokens" ready...'))


module.exports = tokensTable;
