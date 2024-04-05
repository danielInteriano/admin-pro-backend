const { response } = require('express');
const Hospital = require('../models/hospital');

const getHospitales = async (req, res = response) => {
	const hospitales = await Hospital.find().populate(
		'usuario',
		'name email img'
	);

	res.json({
		ok: true,
		hospitales,
	});
};

const crearHospital = async (req, res = response) => {
	//creando el hospital
	const id = req.id;
	const hospital = new Hospital({ usuario: id, ...req.body });

	try {
		//guardando hospital
		const hospitalDB = await hospital.save();

		res.status(200).json({
			ok: true,
			hospital: hospitalDB,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			ok: false,
			msg: 'Error en el servidor',
		});
	}
};

const actualizarHospital = async (req, res = response) => {
	const id = req.params.id;
	try {
		const existeHospital = await Hospital.findById(id);

		//Si el hospital no esta registrado
		if (!existeHospital) {
			res.status(404).json({
				ok: false,
				msg: 'El hospital no está registrado',
			});
		}

		//Si el hospital está registrado
		const { idUsuario, ...campos } = req.body;
		const hospitalActualizado = await Hospital.findByIdAndUpdate(id, campos, {
			new: true,
		});
		res.status(200).json({
			ok: true,
			hospital: hospitalActualizado,
		});
	} catch (error) {
		console.log(error);
		res.status(404).json({
			ok: false,
			msg: 'Error en el servidor',
		});
	}
};

const eliminarHospital = async (req, res = response) => {
	const id = req.params.id;
	try {
		//verificar si el hospital existe
		const existeHospital = await Hospital.findById(id);
		if (!existeHospital) {
			res.status(404).json({
				ok: false,
				msg: 'No se encontró el hospital',
			});
		}

		//eliminando hospital si existe
		await Hospital.findByIdAndDelete(id);
		res.status(200).json({
			ok: true,
			msg: 'Hospital eliminado exitosamente',
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
	getHospitales,
	crearHospital,
	actualizarHospital,
	eliminarHospital,
};
