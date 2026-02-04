const path = require('path');
const fs = require('fs');
const { response } = require('express');
const { v4: uuidv4 } = require('uuid');
const { actualizarImagen } = require('../helpers/actualizar-imagen');

const guardarArchivo = async (req, res = response) => {
    try {
        // Capturando parámetros de la URL
        const coleccion = req.params.coleccion;
        const id = req.params.id;

        const colecciones = ['usuarios', 'medicos', 'hospitales'];

        // Validando que la colección exista
        if (!colecciones.includes(coleccion)) {
            return res.status(400).json({
                ok: false,
                msg: 'La colección donde desea guardar no existe.',
            });
        }

        // Validar que existe el archivo
        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).json({
                ok: false,
                msg: 'No se seleccionó ningún archivo',
            });
        }

        const file = req.files.imagen;

        // Obtener extensión del archivo
        const nombreCortado = file.name.split('.');
        let extensionArchivo = nombreCortado.length > 1 
            ? nombreCortado[nombreCortado.length - 1].toLowerCase() 
            : '';

        // Si no hay extensión, usar MIME type
        const extensionesValidas = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
        if (!extensionesValidas.includes(extensionArchivo)) {
            switch (file.mimetype) {
                case 'image/jpeg': extensionArchivo = 'jpg'; break;
                case 'image/png':  extensionArchivo = 'png'; break;
                case 'image/gif':  extensionArchivo = 'gif'; break;
                case 'image/webp': extensionArchivo = 'webp'; break;
                default:
                    return res.status(400).json({
                        ok: false,
                        msg: 'El archivo no es válido',
                        extensionesValidas,
                    });
            }
        }

        // Generar nombre único para el archivo
        const nombreArchivo = `${uuidv4()}.${extensionArchivo}`;

        // Verificar si existe la carpeta uploads
        const uploadPath = `./uploads/${coleccion}`;
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }

        // Path completo del archivo
        const pathArchivo = path.join(uploadPath, nombreArchivo);

        // Mover la imagen al directorio correspondiente
        file.mv(pathArchivo, (e) => {
            if (e) {
                console.error('ERROR AL MOVER ARCHIVO:', e);
                return res.status(500).json({
                    ok: false,
                    msg: 'Error al mover el archivo.',
                });
            }

            // Actualizar imagen en DB (descomentar si quieres)
            actualizarImagen(coleccion, id, nombreArchivo);

            return res.json({
                ok: true,
                msg: 'Archivo subido exitosamente',
                nombreArchivo,
            });
        });

    } catch (err) {
        console.error('ERROR en guardarArchivo:', err);
        return res.status(500).json({
            ok: false,
            msg: 'Error interno del servidor',
        });
    }
};

const retornaImagen = async (req, res = response) => {
    const coleccion = req.params.coleccion;
    const foto = req.params.foto;

    const pathImg = path.join(__dirname, `../uploads/${coleccion}/${foto}`);

    // Manejo de imagen por defecto
    if (fs.existsSync(pathImg)) {
        return res.sendFile(pathImg);
    } else {
        const defaultPathImg = path.join(__dirname, `../uploads/no-img.jpg`);
        return res.sendFile(defaultPathImg);
    }
};

module.exports = { guardarArchivo, retornaImagen };

/* const guardarArchivo = async (req, res = response) => {
	console.log('req.body:', req.body);
	console.log('req.files:', req.files);

	//capturando los parametros de la url
	const coleccion = req.params.coleccion;
	const id = req.params.id;

	const colecciones = ['usuarios', 'medicos', 'hospitales'];

	//validando que la coleccion donde desea guardar exista
	if (!colecciones.includes(coleccion)) {
		return res.status(400).json({
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
		return res.status(400).json({
			ok: false,
			msg: 'El archivo no es válido',
			extensionesValidas,
		});
	}

	//generando nombre del archivo a guardar
	const nombreArchivo = `${uuidv4()}.${extensionArchivo}`;

	//verificando si existe la carpeta uploads
	const uploadPath = `./uploads/${coleccion}`;
	if (!fs.existsSync(uploadPath)) {
 		fs.mkdirSync(uploadPath, { recursive: true }); 
	}

	//Path completo de la carpeta creada
	const pathArchivo = path.join(uploadPath, nombreArchivo);

	//moviendo la imagen
	file.mv(pathArchivo, (e) => {
		if (e) {
			console.error('ERROR AL MOVER ARCHIVO:', e);
			return res.status(500).json({
				ok: false,
				msg: 'Error al mover el archivo.',
			});
		}

		//actualizar imagen en DB
		actualizarImagen(coleccion, id, nombreArchivo);

		return res.json({
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
		return res.sendFile(pathImg);
	} else {
		const defaultPathImg = path.join(__dirname, `../uploads/no-img.jpg`);
		return res.sendFile(defaultPathImg);
	}
}; */

module.exports = { guardarArchivo, retornaImagen };
