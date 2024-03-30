/*
    Ruta: /api/usuarios
*/

const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { getUsuarios, crearUsuario, actualizarUsuario, eliminarUsuario } = require('../controllers/usuarios');

const router = Router();

//obtener usuarios
router.get('/', validarJWT, getUsuarios);

//guardar un usuario
router.post(
	'/',
	[
		check('name', 'El nombre es obligatorio').not().isEmpty(),
		check('password', 'La password es obligatoria').not().isEmpty(),
		check('email', 'El nombre es obligatorio').isEmail(),
		validarCampos,
	],
	crearUsuario
);

//actualizar un usuario
router.put(
	'/:id',
	[
		validarJWT,
		check('name', 'El nombre es obligatorio').not().isEmpty(),
		check('password', 'La password es obligatoria').not().isEmpty(),
		check('role', 'El role es obligatorio').not().isEmpty(),
		validarCampos,
	],
	actualizarUsuario
);

//eliminar un usuario
router.delete(
	'/:id',
	[
		validarJWT,
		check('name', 'El nombre es obligatorio').not().isEmpty(),
		check('password', 'La password es obligatoria').not().isEmpty(),
		check('role', 'El role es obligatorio').not().isEmpty(),
	],
	eliminarUsuario
);

module.exports = router;
