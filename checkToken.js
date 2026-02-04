require('dotenv').config();
const jwt = require('jsonwebtoken');

// Pega aquí tu token (el que obtuviste de Angular)
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5NjlhYmFhZjU0YWUzOGI0Mzc1Zjg3MiIsImlhdCI6MTc2OTE0MjU0LCJleHAiOjE3NjkxODU3NDR9.Jk_wPQnXA17Qc9BR3jNoJaTUGA1SCpZS5_98ZD8ZIkw";

// Tu secret (el mismo que usas en process.env.JWT_SECRET)
const secret = process.env.JWT_SECRET;

try {
  const decoded = jwt.verify(token, secret);
  console.log('✅ Token válido:', decoded);
} catch (err) {
  console.error('❌ Error verificando token:', err);
}
