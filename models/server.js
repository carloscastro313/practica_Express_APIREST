const express = require('express');
const fileupload = require('express-fileupload');
const cors = require('cors');
const { db } = require('../config/sql');
const userRoutes = require('../routes/usuario.route');
const mascotaRoutes = require('../routes/mascota.route');
const loginRoutes = require('../routes/login.route');

class Server {
    constructor() {
        this.app = express();
        this.PORT = process.env.PORT || 8000;

        this.dbConnection();
        this.middlewares();

        this.router();
    }

    async dbConnection() {
        try {
            await db.authenticate();
            console.log('Conectado a DB con exito');
        } catch (error) {
            console.log(error);
        }
    }

    middlewares() {
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(fileupload());
    }

    router() {
        this.app.use(userRoutes);
        this.app.use(mascotaRoutes);
        this.app.use(loginRoutes);
    }

    listen() {
        this.app.listen(this.PORT, () => {
            console.log('Server conectado en el puerto', this.PORT);
        })
    }
}

module.exports = {
    Server
}