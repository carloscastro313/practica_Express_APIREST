const { request, response } = require('express');
const { body } = require('express-validator');
const { Usuario } = require('../models/usuarios.model');
const fs = require('fs');
const path = require('path');
const JWT = require('jsonwebtoken');
const { arch } = require('os');

const postUsuario = async(req = request, res = response) => {
    const { email, clave, nombre, apellido, perfil, foto } = req.body;

    try {
        const existe = await Usuario.findOne({
            where: {
                email
            }
        });

        if (existe) {
            return res.status(418).json({
                exito: false,
                mensaje: 'Ya existe usuario con ese email'
            })
        }

        let nuevo = await Usuario.create({ email, clave, nombre, apellido, perfil, foto });
        nuevo.save();

        return res.status(200).json({
            exito: true,
            mensaje: 'Se a creado usuario ' + email
        });

    } catch (error) {
        return res.status(500).json({
            exito: false,
            mensaje: 'Error en el servidor '
        });
    }
};

const getUsuarios = async(req = request, res = response) => {
    try {
        const usuarios = await Usuario.findAll();
        let stringJson = JSON.stringify(usuarios);
        return res.status(200).json({
            exito: true,
            mensaje: 'GET usuarios',
            tabla: stringJson
        });
    } catch (error) {
        console.log(error);
        return res.status(424).json({
            exito: false,
            mensaje: 'No se pudo traer listado usuarios'
        });
    }
}

const getLog = async(req = request, res = response) => {
    const { token } = req.headers;
    const { archivo } = req.query;
    try {
        const { perfil } = JWT.decode(token);
        const txt = log(archivo, perfil);

        return res.status(200).json({
            exito: true,
            mensaje: txt.toString()
        });
    } catch (error) {
        return res.status(403).json({
            exito: false,
            mensaje: error.message
        });
    }
}

const log = (tipo, perfil) => {
    let retorno = '';
    switch (tipo) {
        case 'b':
            if (perfil == 'propietario' || perfil == 'empleado') {
                retorno = fs.readFileSync(path.join(__dirname, '../log/borrados.log'), { flag: 'r' });
            } else {
                throw new Error('Perfil no autorizado');
            }

            break;
        case 'nb':
            if (perfil == 'propietario' || perfil == 'encargado') {
                retorno = fs.readFileSync(path.join(__dirname, '../log/no_borrados.log'), { flag: 'r' });
            } else {
                throw new Error('Perfil no autorizado');
            }

            break;
        case 'm':
            if (perfil == 'propietario' || perfil == 'empleado') {
                retorno = fs.readFileSync(path.join(__dirname, '../log/modificados.log'), { flag: 'r' });
            } else {
                throw new Error('Perfil no autorizado');
            }

            break;
        case 'nm':
            if (perfil == 'propietario' || perfil == 'encargado') {
                retorno = fs.readFileSync(path.join(__dirname, '../log/no_modificados.log'), { flag: 'r' });
            } else {
                throw new Error('Perfil no autorizado');
            }

            break;
        default:
            throw new Error('Tipo no valido')
            break;
    }

    return retorno;
}


module.exports = {
    postUsuario,
    getUsuarios,
    getLog
}