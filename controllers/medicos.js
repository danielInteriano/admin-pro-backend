const { response } = require('express');
const Medico = require('../models/medico');
const Usuario = require('../models/usuario');
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');
const medico = require('../models/medico');

//obtener medicos
const getMedicos = async (req, res) => {
	const medicos = await Medico.find()
		.populate('usuario', 'name email img')
		.populate('hospital', 'name direccion img');

	res.json({
		ok: true,
		medicos,
	});
};

//crear medico
const crearMedico = async (req, res = response) => {
	//creando un medico
	const id = req.id;
	const { email, password } = req.body;
	const medico = new Medico({ usuario: id, ...req.body });

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

		//encriptar password
		const salt = bcrypt.genSaltSync();
		medico.password = bcrypt.hashSync(password, salt);

		//guardando medico
		const medicoDB = await medico.save();

		//creando token de usuario
		const token = await generarJWT(medico.id);
		medico.token = token;

		res.status(200).json({
			ok: true,
			medico: medicoDB,
			token,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			ok: false,
			msg: 'Error en el servidor',
		});
	}
};

//actualizar un medico
const actualizarMedico = async (req, res = response) => {
	const id = req.params.id;
	try {
		//verificar si el medico existe
		const existeMedico = await medico.findById(id);

		if (!existeMedico) {
			res.json({
				ok: false,
				msg: 'El medico no existe',
			});
		}

		const { password, email, google, ...campos } = req.body;
		//verificar si el email está registrado
		if (existeMedico.email !== email) {
			const emailExiste = await Medico.findOne({ email });
			if (emailExiste) {
				return res.status(400).json({
					ok: false,
					msg: 'Ya existe un medico con ese email',
				});
			}
		}

		campos.email = email;
		const medicoActualizado = await Medico.findByIdAndUpdate(id, campos, {
			new: true,
		});

		res.json({
			ok: true,
			medico: medicoActualizado,
		});
	} catch (error) {
		console.log(error);
		res.status(404).json({
			ok: false,
			msg: 'Problemas con el servidor',
		});
	}
};

//eliminar un medico
const eliminarMedico = async (req, res = response) => {
	const id = req.params.id;
	try {
		//verificar si el medico existe
		const encontrado = await Medico.findById(id);
		if (!encontrado) {
			res.status(404).json({
				ok: false,
				msg: 'No se encontró usuario con ese id.',
			});
		}

		//eliminando medico si existe
		await Medico.findByIdAndDelete(id);
		res.status(200).json({
			ok: true,
			msg: 'Medico eliminado exitosamente',
		});
	} catch (error) {
		console.log(error);
		res.status(400).json({
			ok: false,
			msg: 'Problemas al eliminar medico',
		});
	}
};

module.exports = {
	getMedicos,
	crearMedico,
	actualizarMedico,
	eliminarMedico,
};
