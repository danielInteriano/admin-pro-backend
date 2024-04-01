/*
    Ruta: /api/medicos
*/

const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const {
	getMedicos,
	crearMedico,
	//actualizarMedico,
	//eliminarMedico,
} = require('../controllers/medicos');

const router = Router();

//obtener los medicos
router.get('/', validarJWT, getMedicos);

//guardar un medico
router.post(
	'/',
	[
		check('name', 'El campo es obligatorio').not().isEmpty(),
		check('email', 'El email no es válido').isEmail(),
		check('password', 'La contraseña es obligatoria').not().isEmpty(),
		validarCampos,
	],
	crearMedico
);

//actualizar un medico
router.put(
	'/:id',
	[validarCampos, check('direccion', 'La dirección es obligatoria')]
	//actualizarMedico
);

//eliminar un medico
router.delete(
	'/:id',
	[]
	//eliminarMedico
);

module.exports = router;
