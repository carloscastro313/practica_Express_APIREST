const { Router } = require("express");
const { postMascota, getMascotas, deleteMascota, putMascota } = require('../controllers/mascota.controller');
const { oneOf, check, body } = require('express-validator');
const router = Router();

router.post('/', postMascota);
router.delete('/:id', deleteMascota);
router.put('/', putMascota);
router.get('/mascotas', getMascotas);

module.exports = router;