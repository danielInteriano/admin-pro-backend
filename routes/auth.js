/*
    Ruta: /api/login
*/

const { Router } = require('express');
const { login, googleSingIn } = require('../controllers/auth');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');

const router = Router();

//obtener usuario
//si esta registrado permitirle logearse
router.post(
	'/',
	[
		check('email', 'El email es obligatorio').isEmail(),
		check('password', 'La contraseña es obligatoria').not().isEmpty(),
		validarCampos,
	],
	login
);

//login con Google
router.post(
	'/google',
	[
		check('token', 'El Token de google es obligatorio').not().isEmpty(),
		validarCampos,
	],
	googleSingIn
);

module.exports = router;
