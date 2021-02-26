const { request, response } = require('express');
const { body } = require('express-validator');
const fs = require('fs');
const path = require('path');
const JWT = require('jsonwebtoken');
const { Mascota } = require('../models');

const tipos = ['perro', 'gato', 'tortuga']

const postMascota = async(req = request, res = response) => {
    const { nombre, tipo, edad } = req.body;

    try {

        if (!tipos.includes(tipo) || !nombre || !edad) {
            return res.status(418).json({
                exito: false,
                mensaje: 'Mascota invalida'
            });
        }

        let mascotaNueva = await Mascota.create({ nombre, tipo, edad });
        mascotaNueva.save();

        return res.status(200).json({
            exito: true,
            mensaje: 'Se a creado usuario ' + nombre
        });

    } catch (error) {
        return res.status(500).json({
            exito: false,
            mensaje: 'Error en el servidor: ' + error
        });
    }
}

const getMascotas = async(req = request, res = response) => {
    try {

        const mascotas = await Mascota.findAll();
        let stringJson = JSON.stringify(mascotas);
        return res.status(200).json({
            exito: true,
            mensaje: 'GET mascotas',
            tabla: stringJson
        });
    } catch (error) {
        return res.status(424).json({
            exito: false,
            mensaje: 'No se pudo traer listado mascotas'
        });
    }
}

const deleteMascota = async(req = request, res = response) => {
    const { id } = req.params;
    const { token } = req.headers;
    let usuario = {};
    try {

        usuario = JWT.decode(token);
        if (!usuario) {
            throw new Error('token no valido');
        }
        console.log(id);
        const mascota = await Mascota.findByPk(parseInt(id));

        if (!mascota) {
            throw new Error('No existe mascota');
        }

        mascota.destroy().then(({ id }) => {
            fs.writeFileSync(path.join(__dirname, '../log/borrados.log'), `${new Date().toISOString()} - ${usuario.nombre} ${usuario.apellido} - id: ${id}\n`, { flag: 'a' });

            return res.status(200).json({
                exito: true,
                mensaje: 'Se borro id: ' + id,
            });
        }).catch((err) => {
            return res.status(500).json({
                exito: false,
                mensaje: err
            });
        })
    } catch (error) {
        fs.writeFileSync(path.join(__dirname, '../log/no_borrados.log'), `${new Date().toISOString()} - ${usuario.nombre} ${usuario.apellido} ${usuario.perfil}- id: ${id}\n`, { flag: 'a' });
        return res.status(418).json({
            exito: false,
            mensaje: error.message
        });
    }
}


const putMascota = async(req = request, res = response) => {
    const { nombre, edad, id, tipo } = req.body;
    const { token } = req.headers;
    let usuario = {};
    try {

        usuario = JWT.decode(token);
        if (!usuario) {
            throw new Error('token no valido');
        }
        const mascota = await Mascota.findByPk(parseInt(id));

        if (!mascota) {
            throw new Error('No existe mascota');
        }
        mascota.nombre = nombre;
        mascota.edad = edad;
        mascota.tipo = tipo;

        mascota.save().then(({ id }) => {
            fs.writeFileSync(path.join(__dirname, '../log/modificados.log'), `${new Date().toISOString()} - ${usuario.nombre} ${usuario.apellido} - ${mascota.nombre} ${mascota.apellido} id: ${id}\n`, { flag: 'a' });

            return res.status(200).json({
                exito: true,
                mensaje: 'Se borro id: ' + id,
            });
        }).catch((err) => {
            return res.status(500).json({
                exito: false,
                mensaje: err
            });
        })
    } catch (error) {
        fs.writeFileSync(path.join(__dirname, '../log/no_modificados.log'), `${new Date().toISOString()} - ${usuario.nombre} ${usuario.apellido} ${usuario.perfil}- id: ${id}\n`, { flag: 'a' });
        return res.status(418).json({
            exito: false,
            mensaje: error.message
        });
    }
}

module.exports = {
    postMascota,
    getMascotas,
    deleteMascota,
    putMascota
}