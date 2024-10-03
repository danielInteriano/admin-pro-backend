/*
    Ruta: /api/:busqueda
*/

const { Router } = require('express');
const { getTodo, getBusquedaColeccion } = require('../controllers/busquedas');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

//busqueda de información si existe
router.get('/:busqueda', validarJWT, getTodo);
router.get('/:tabla/:busqueda', validarJWT, getBusquedaColeccion);

module.exports = router;
