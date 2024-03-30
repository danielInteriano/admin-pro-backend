require('dotenv').config();
const jwt = require('jsonwebtoken');

const generarJWT = (id) => {
	return new Promise((resolve, reject) => {
		const payload = {
			id,
		};
		const jwtSecret = process.env.JWT_SECRET;

		jwt.sign(payload, jwtSecret, { expiresIn: '12h' }, (error, token) => {
			if (error) {
				console.log(error);
				reject('No se logró generar el JWT');
			} else {
				resolve(token);
			}
		});
	});
};

module.exports = { generarJWT };
