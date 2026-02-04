require('dotenv').config();

const express = require('express');
const cors = require('cors');

const { dbConnection } = require('./database/config');
const fileUpload = require('express-fileupload');

//crear el servidor de express
const app = express();

//configurar cors
app.use(cors({
	origin: 'http://localhost:4200',
  	methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  	allowedHeaders: ['Content-Type', 'Authorization', 'x-token'],
	credentials: true,
	exposedHeaders: ['x-token']
}));

const os=require('os');
//control de subirda de archivos
app.use(fileUpload({
	useTempFiles: true,
	tempFileDir: os.tmpdir(),
	createParentPath: true,
	limits: { fileSize: 5 * 1024 * 1024 },
}));

//Carpeta publica
app.use(express.static('public'));

//Lectura y parseo del body de la petición
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Iniciando DB mongo
dbConnection();

app.options('*', cors({
  origin: 'http://localhost:4200',
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization','x-token'],
  credentials: true
}));

//Rutas
app.use('/api/usuarios', require('./routes/usuarios.js'));
app.use('/api/login', require('./routes/auth.js'));
app.use('/api/hospitales', require('./routes/hospitales.js'));
app.use('/api/medicos', require('./routes/medicos.js'));
app.use('/api/todo', require('./routes/busquedas.js'));
app.use('/api/coleccion', require('./routes/busquedas.js'));
app.use('/api/upload', require('./routes/uploads.js'));

app.listen(process.env.PORT, () => {
	console.log('Servidor corriendo en puerto ' + process.env.PORT);
});
