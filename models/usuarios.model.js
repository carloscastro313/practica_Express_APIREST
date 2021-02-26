const { DataTypes } = require("sequelize");
const { db } = require('../config/sql');

const Usuario = db.define('usuario', {
    correo: {
        type: DataTypes.STRING,
        unique: true
    },
    clave: {
        type: DataTypes.STRING
    },
    nombre: {
        type: DataTypes.STRING
    },
    apellido: {
        type: DataTypes.STRING
    },
    perfil: {
        type: DataTypes.STRING
    },
    foto: {
        type: DataTypes.STRING,
        allowNull: true
    },

}, {
    timestamps: false
});

module.exports = {
    Usuario
}