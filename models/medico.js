const { Schema, model } = require('mongoose');

const MedicoSchema = Schema({
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
	},
	google: {
		type: Boolean,
		defaul: false,
	},
	usuario: {
		type: Schema.Types.ObjectId,
		ref: 'Usuario',
		required: true,
	},
	hospital: {
		type: Schema.Types.ObjectId,
		ref: 'Hospital',
		required: true,
	},
});

MedicoSchema.method('toJSON', function () {
	const { __v, _id, password, ...object } = this.toObject();
	object.id = _id;
	return object;
});

module.exports = model('Medico', MedicoSchema);
