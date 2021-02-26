const { Router } = require("express");
const { postUsuario, getUsuarios, getLog } = require('../controllers/usuario.controller');
const { oneOf, check, body } = require('express-validator');
const router = Router();

router.post('/usuarios', postUsuario);
router.get('/', getUsuarios);
router.get('/log', getLog);
module.exports = router;