const { response } = require('express');
const Usuario = require('../models/usuario');
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');
const { googleVerify } = require('../helpers/google-verify');

const login = async (req, res = response) => {
	const { email, password } = req.body;

	try {
		//varificando email
		const usuario = await Usuario.findOne({ email });
		if (!usuario) {
			return res.status(404).json({
				ok: false,
				msg: 'Email no es válido',
			});
		}
		//verificando password
		const validarPassword = bcrypt.compareSync(password, usuario.password);
		if (!validarPassword) {
			return res.status(400).json({
				ok: false,
				msg: 'El password no es válido',
			});
		}

		//generar un JWT para luego logearse
		const token = await generarJWT(usuario.id);

		return res.status(200).json({
			ok: true,
			token,
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			ok: false,
			msg: 'Error en el servidor',
		});
	}
};

const googleSingIn = async (req, res = response) => {
	try {
		const { email, name, picture } = await googleVerify(req.body.token);
		let usuarioDB = await Usuario.findOne({ email });
		let usuario;

		//verificando si el usuario existe
		if (!usuarioDB) {
			usuario = new Usuario({
				name: name,
				email: email,
				password: 'interiano',
				img: picture,
				google: true,
			});
		} else {
			usuario = usuarioDB;
			usuario.google = true;
		}

		//guardando usuario en DB
		await usuario.save();

		//creando token
		//generar un JWT para luego logearse
		const token = await generarJWT(usuario.id);

		res.status(200).json({
			ok: true,
			email,
			name,
			picture,
			token,
		});
	} catch (error) {
		res.status(400).json({
			ok: false,
			msg: 'El token de Google no es correcto',
		});
	}
};

const renewToken = async (req, res = response) => {
	const id = req.id;

	//generar un JWT para luego logearse
	const token = await generarJWT(id);

	//obtener el usuario
	const usuario = await Usuario.findById(id);

	res.json({
		ok: true,
		token,
		usuario,
	});
};

module.exports = {
	login,
	googleSingIn,
	renewToken,
};
