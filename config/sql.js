const { Sequelize } = require('sequelize');

const db = new Sequelize('veterinaria_bd', 'root', '', {
    host: 'localhost',
    dialect: 'mysql'
});

module.exports = {
    db
}