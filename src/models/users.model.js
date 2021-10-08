
const sequelize = require('sequelize');
const config = require('../config/db.config');
const db = new sequelize(config.connectObj);


const usersTable = db.define('users', {
    id: { type: sequelize.BIGINT, primaryKey: true, autoIncrement: true },
    email: { type: sequelize.STRING(50), unique: true },
    password: { type: sequelize.STRING, allowNull: true },
    firstname: sequelize.STRING(50),
    lastname: sequelize.STRING(50),
    tel: sequelize.STRING(20),
    address: sequelize.STRING,
    avatar: sequelize.STRING,
    accounttype: { type: sequelize.SMALLINT, defaultValue: '3' },
    authentication: { type: sequelize.STRING(50), defaultValue: 'Default' },
    locked: { type: sequelize.BOOLEAN, defaultValue: false },
    actived: { type: sequelize.BOOLEAN, defaultValue: false }
});

//Create table
db.sync()
    .then(() => console.log('-Table "users" ready...'))


module.exports = usersTable;
