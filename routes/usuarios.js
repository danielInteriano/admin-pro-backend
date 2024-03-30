/*
    Ruta: /api/usuarios
*/

const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { getUsuarios, crearUsuario, actualizarUsuario, eliminarUsuario } = require('../controllers/usuarios');
const router = Router();

//obtener usuarios
router.get('/', getUsuarios);

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
		check('name', 'El nombre es obligatorio').not().isEmpty(),
		check('password', 'La password es obligatoria').not().isEmpty(),
		check('role', 'El role es obligatorio').isEmail(),
		validarCampos,
	],
	actualizarUsuario
);

//eliminar un usuario
router.delete(
	'/:id',
	[
		check('name', 'El nombre es obligatorio').not().isEmpty(),
		check('password', 'La password es obligatoria').not().isEmpty(),
		check('role', 'El role es obligatorio').isEmail(),
	],
	eliminarUsuario
);

module.exports = router;
