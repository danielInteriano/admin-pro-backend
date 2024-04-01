const { response } = require('express');
const Medico = require('../models/medico');
const Usuario = require('../models/usuario');
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');

//obtener medicos
const getMedicos = async (req, res) => {
	const medicos = await Medico.find({}, 'email name img google');

	res.json({
		ok: true,
		medicos,
	});
};

//crear medico
const crearMedico = async (req, res = response) => {
	const { email, password } = req.body;

	try {
		//verificar email en Medicos
		let existeEmail1 = await Medico.findOne({ email });
		if (existeEmail1) {
			res.status(400).json({
				ok: false,
				msg: 'El email ya esta registrado',
			});
		}

		//verificar email en Usuarios
		let existeEmail2 = await Usuario.findOne({ email });
		if (existeEmail2) {
			res.status(400).json({
				ok: false,
				msg: 'El email ya esta registrado',
			});
		}

		//creando el médico
		const medico = new Medico(req.body);

		//encriptar password
		const salt = bcrypt.genSaltSync();
		medico.password = bcrypt.hashSync(password, salt);

		//guardando medico
		await medico.save();

		//creando token de usuario
		const token = await generarJWT(medico.id);
		medico.token = token;

		res.status(200).json({
			ok: true,
			medico,
			token,
		});
	} catch (error) {
		console.log(error);
		res.status(404).json({
			ok: false,
			msg: 'Error en el servidor',
		});
	}
};

module.exports = {
    getMedicos,
	crearMedico,
};
