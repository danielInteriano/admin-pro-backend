const fs = require('fs');
const Usuario = require('../models/usuario');
const Medico = require('../models/medico');
const Hospital = require('../models/hospital');

//funcion para borrar
const borrarImagen = (path) => {
	if (fs.existsSync(path)) {
		try {
			//borrado de la imagen
			fs.unlinkSync(path);
		} catch (e) {
			console.log('Error al borrar la imagen', e);
		}
	}
};

const cambiarImagen = async (modelo, coleccion, nombreArchivo) => {
	const coleccionSingular = coleccion.slice(0, -1);
	//validando si el usuario existe
	if (!modelo) {
		console.log(
			`No se encontró la imagen del ${coleccionSingular} con ese id.`
		);
		return false;
	}

	//path anterior de la imagen si existe
	const pathAnterior = `./uploads/${coleccion}/${modelo.img}`;
	borrarImagen(pathAnterior);

	//actualizando el nuevo archivo de imagen en la DB
	modelo.img = nombreArchivo;
	await modelo.save();
	return true;
};

const actualizarImagen = async (coleccion, id, nombreArchivo) => {
	//verificando la colección a actualizar
	switch (coleccion) {
		case 'usuarios':
			const usuario = await Usuario.findById(id);
			cambiarImagen(usuario, coleccion, nombreArchivo);
			break;

		case 'medicos':
			const medico = await Medico.findById(id);
			cambiarImagen(medico, coleccion, nombreArchivo);
			break;

		case 'hospitales':
			const hospital = await Hospital.findById(id);
			cambiarImagen(hospital, coleccion, nombreArchivo);
			break;

		default:
			break;
	}
};

module.exports = { actualizarImagen };
