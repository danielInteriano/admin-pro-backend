/*
    Ruta: /api/hospitales
*/

const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const {
	getHospitales,
	crearHospital,
	actualizarHospital,
	eliminarHospital,
} = require('../controllers/hospitales');

const router = Router();

//obtener los hospitales
router.get('/', validarJWT, getHospitales);

//crear un hospital
router.post(
	'/',
	[
		validarJWT,
		check('name', 'El nombre del hospital es obligatorio').not().isEmpty(),
		validarCampos,
	],
	crearHospital
);

//actualizar un hospital
router.put(
	'/:id',
	[
		validarCampos,
		check('direccion', 'La dirección del hospital es obligatoria'),
	],
	actualizarHospital
);

//eliminar un usuario
router.delete('/:id', [], eliminarHospital);

module.exports = router;
