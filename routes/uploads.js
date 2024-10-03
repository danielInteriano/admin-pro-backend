/*
    Ruta: /uploads/:coleccion/:archivo
*/

const { Router } = require('express');
const fileUpload = require('express-fileupload');

const { guardarArchivo, retornaImagen } = require('../controllers/uploads');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();
router.use(fileUpload());

//guardar un archivo
router.put('/:coleccion/:id', validarJWT, guardarArchivo);
router.get('/:coleccion/:foto', validarJWT, retornaImagen);

module.exports = router;
