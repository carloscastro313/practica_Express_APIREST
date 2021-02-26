const { DataTypes } = require("sequelize");
const { db } = require('../config/sql');

const Mascota = db.define('mascotas', {
    nombre: {
        type: DataTypes.STRING
    },
    tipo: {
        type: DataTypes.STRING
    },
    edad: {
        type: DataTypes.INTEGER,
    },
}, {
    timestamps: false
});

module.exports = {
    Mascota
}