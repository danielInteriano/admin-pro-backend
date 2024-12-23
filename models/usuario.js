const { Schema, model } = require('mongoose');

const UsuarioSchema = Schema({
	name: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
		unique: true,
	},
	password: {
		type: String,
		required: true,
	},
	img: {
		type: String,
		defaul: './uploads/usuarios/eb249f2b-49a8-4713-84f7-36d404b24d0b.png',
	},
	role: {
		type: String,
		required: true,
		default: 'USER_ROLE',
	},
	google: {
		type: Boolean,
		defaul: false,
	},
});

UsuarioSchema.method('toJSON', function () {
	const { __v, _id, password, ...object } = this.toObject();
	object.id = _id;
	return object;
});

module.exports = model('Usuario', UsuarioSchema);
