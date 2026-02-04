const { Schema, model } = require('mongoose');

const HospitalSchema = Schema(
	{
		name: {
			type: String,
			required: true,
		},
		direccion: {
			type: String,
		},
		img: {
			type: String,
			defaul: './uploads/hospitales/no-hospital.png',
		},
		usuario: {
			required: true,
			type: Schema.Types.ObjectId,
			ref: 'Usuario',
		},
	},
	{ collection: 'hospitales' }
);

HospitalSchema.method('toJSON', function () {
	const { __v, _id, ...object } = this.toObject();
	object.id = _id;
	return object;
});

module.exports = model('Hospital', HospitalSchema);
