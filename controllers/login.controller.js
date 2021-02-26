const { request, response } = require('express');
const { Usuario } = require('../models');
const JWT = require('jsonwebtoken');

const postLogin = async(req = request, res = response) => {
    const { correo, clave } = req.body;
    try {
        const usuario = await Usuario.findOne({
            where: {
                correo
            },
        });

        if (!usuario) {
            throw new Error('No existe email');
        } else if (usuario.clave !== clave) {
            throw new Error('Clave incorrecta');
        }
        const jwt = JWT.sign({
            correo: usuario.correo,
            nombre: usuario.nombre,
            apellido: usuario.apellido,
            perfil: usuario.perfil,
        }, process.env.KEY, {
            expiresIn: Math.floor(Date.now() / 1000) + (60 * 60),
        });
        res.status(200).json({
            exito: true,
            jwt
        })
    } catch (error) {
        res.status(424).json({
            exito: true,
            mensaje: error.message,
            jwt: null
        })
    }
}

module.exports = {
    postLogin
}