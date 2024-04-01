const { response } = require('express');
const Usuario = require('../models/usuario');
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');

const getUsuarios = async (req, res) => {
	const usuarios = await Usuario.find({}, 'email name role google');

	res.json({
		ok: true,
		usuarios,
	});
};

const crearUsuario = async (req, res = response) => {
	const { email, password } = req.body;

	try {
		const existeEmail = await Usuario.findOne({ email });

		if (existeEmail) {
			res.status(400).json({
				ok: false,
				msg: 'El email ya está registrado',
			});
		}
		const usuario = new Usuario(req.body);

		//encriptar password
		const salt = bcrypt.genSaltSync();
		usuario.password = bcrypt.hashSync(password, salt);

		//guardar usuario
		await usuario.save();

		//creando token de usuario
		const token = await generarJWT(usuario.id);
		usuario.token = token;

		res.json({
			ok: true,
			usuario,
			token,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			ok: false,
			msg: 'Error interno, revisar logs.',
		});
	}
};

const actualizarUsuario = async (req, res = response) => {
	const id = req.params.id;
	try {
		const usuarioDB = await Usuario.findById(id);

		//Si el usuario no existe
		if (!usuarioDB) {
			res.status(404).json({
				ok: false,
				msg: `No se encontró usuario con el id = ${id}`,
			});
		}

		//Si el usuario existe
		//Realizar actualizacion de los campos necesarios
		const { password, email, google, ...campos } = req.body;

		if (usuarioDB.email !== email) {
			const emailExiste = await Usuario.findOne({ email });
			if (emailExiste) {
				return res.status(400).json({
					ok: false,
					msg: 'Ya existe un usuario con ese email',
				});
			}
		}
		campos.email = email;
		const usuarioActualizado = await Usuario.findByIdAndUpdate(id, campos, {
			new: true,
		});

		res.json({
			ok: true,
			usuario: usuarioActualizado,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			ok: false,
			msg: 'No se puede actualizar el usuario.',
		});
	}
};

//eliminar un usuario
const eliminarUsuario = async (req, res = response) => {
	const id = req.params.id;
	try {
		//verificar si el usuario existe
		const encontrado = await Usuario.findById(id);
		if (!encontrado) {
			res.status(404).json({
				ok: false,
				msg: 'No se encontró usuario con ese id.',
			});
		}

		//eliminando usuario si existe
		await Usuario.findByIdAndDelete(id);
		res.status(200).json({
			ok: true,
			msg: 'Usuario eliminado exitosamente',
		});
	} catch (error) {
		console.log(error);
		res.status(400).json({
			ok: false,
			msg: 'Problemas al eliminar usuario',
		});
	}
};

module.exports = {
	getUsuarios,
	crearUsuario,
	actualizarUsuario,
	eliminarUsuario,
};
