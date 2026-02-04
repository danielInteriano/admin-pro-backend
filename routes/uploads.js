/*
    Ruta: /uploads/:coleccion/:archivo
*/

const { Router } = require('express');

const { guardarArchivo, retornaImagen } = require('../controllers/uploads');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

//guardar un archivo
router.put('/:coleccion/:id', validarJWT, guardarArchivo);
router.get('/:coleccion/:foto', retornaImagen);

module.exports = router;
