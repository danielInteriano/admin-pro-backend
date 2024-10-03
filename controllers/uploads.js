const path = require('path');
const fs = require('fs');
const { response } = require('express');
const { v4: uuidv4 } = require('uuid');
const { actualizarImagen } = require('../helpers/actualizar-imagen');

const guardarArchivo = async (req, res = response) => {
	//capturando los parametros de la url
	const coleccion = req.params.coleccion;
	const id = req.params.id;

	const colecciones = ['usuarios', 'medicos', 'hospitales'];

	//validando que la coleccion donde desea guardar exista
	if (!colecciones.includes(coleccion)) {
		res.status(400).json({
			ok: false,
			msg: 'La colección donde desea guardar no existe.',
		});
	}

	//Validar que existe el archivo
	if (!req.files || Object.keys(req.files).length === 0) {
		return res.status(400).json({
			ok: false,
			msg: 'No se seleccionó ningun archivo',
		});
	}

	//procesar la imagen...
	const file = req.files.imagen;

	//nombre cortado y extension del archivo
	const nombreCortado = file.name.split('.');
	const extensionArchivo = nombreCortado[nombreCortado.length - 1];

	//extensiones válidas
	const extensionesValidas = ['jpg', 'png', 'jpeg', 'gif'];

	//validando que la extension del archivo este dentro
	//de las extensiones permitidas
	if (!extensionesValidas.includes(extensionArchivo)) {
		res.status(400).json({
			ok: false,
			msg: 'El archivo no es válido',
			extensionesValidas,
		});
	}

	//generando nombre del archivo a guardar
	const nombreArchivo = `${uuidv4()}.${extensionArchivo}`;

	//Path para guardar la imagen
	//carpeta donde se guardará ña imagen
	const path = `./uploads/${coleccion}/${nombreArchivo}`;

	//moviendo la imagen
	file.mv(path, (e) => {
		if (e) {
			return res.status(500).json({
				ok: false,
				msg: 'Error al mover el archivo.',
			});
		}

		//actualizar imagen en DB
		actualizarImagen(coleccion, id, nombreArchivo);

		res.json({
			ok: true,
			msg: 'Archivo subido exitosamente',
			nombreArchivo,
		});
	});
};

const retornaImagen = async (req, res = response) => {
	const coleccion = req.params.coleccion;
	const foto = req.params.foto;

	const pathImg = path.join(__dirname, `../uploads/${coleccion}/${foto}`);

	//manejo de imagen por defecto
	if (fs.existsSync(pathImg)) {
		res.sendFile(pathImg);
	} else {
		const pathImg = path.join(__dirname, `../uploads/no-img.jpg`);
		res.sendFile(pathImg);
	}
};

module.exports = { guardarArchivo, retornaImagen };
