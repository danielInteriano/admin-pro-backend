const { response } = require('express');
const Hospital = require('../models/hospital');
const Medico = require('../models/medico');
const Usuario = require('../models/usuario');

const getTodo = async (req, res = response) => {
	//recuperando lo que se debe buscar
	const busqueda = req.params.busqueda;
	const regex = new RegExp(busqueda, 'i');

	try {
		//ejecución de varias promesas
		//reducción de tiempo de consulta
		const [usuarios, medicos, hospitales] = await Promise.all([
			Usuario.find({ name: regex }),
			Medico.find({ name: regex }),
			Hospital.find({ name: regex }),
		]);

		res.json({
			ok: true,
			usuarios,
			medicos,
			hospitales,
		});
	} catch (e) {
		console.log(e);
		res.status(500).json({
			ok: false,
			msg: 'Error en el servidor',
		});
	}
};

const getBusquedaColeccion = async (req, res = response) => {
	//recuperando lo que se debe buscar
	const tabla = req.params.tabla;
	const busqueda = req.params.busqueda;
	const regex = new RegExp(busqueda, 'i');
	let data = [];

	switch (tabla) {
		case 'usuarios':
			data = await Usuario.find({ name: regex }).populate(
				'name email password img'
			);
			break;

		case 'hospitales':
			data = await Hospital.find({ name: regex }).populate(
				'usuario',
				'name direccion img'
			);
			break;

		case 'medicos':
			data = await Medico.find({ name: regex })
				.populate('usuario', 'name email password img')
				.populate('hospital', 'name direccion img');
			break;

		default:
			return res.status(400).json({
				ok: false,
				msg: 'La tabla puede ser: usuarios, medicos y hospitales.',
			});
	}
	res.json({
		ok: true,
		resultados: data,
	});
};

module.exports = {
	getTodo,
	getBusquedaColeccion,
};
