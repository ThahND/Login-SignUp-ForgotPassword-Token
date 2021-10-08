
const sequelize = require('sequelize');
const config = require('../config/db.config');
const db = new sequelize(config.connectObj);


const accounttypesTable = db.define('accounttypes', {
    id: { type: sequelize.SMALLINT, primaryKey: true },
    name: sequelize.STRING(50),
});

//Create table
db.sync()
    .then(() => console.log('-Table "accounttypes" ready...'))


module.exports = accounttypesTable;
