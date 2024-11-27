// src/models/user.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  primerNombre: { type: String, required: true, maxlength: 30 },
  segundoNombre: { type: String, maxlength: 30 },
  apellidos: { type: String, required: true, maxlength: 60 },
  fechaNacimiento: { type: Date, required: true },
  genero: { type: String, enum: ['Masculino', 'Femenino', 'No binario', 'NA'], required: true },
  correoElectronico: { type: String, required: true, match: /.+\@.+\..+/ },
  celular: { type: String, required: true, length: 10 },
  nroDocumento: { type: String, required: true, unique: true, maxlength: 10 },
  tipoDocumento: { type: String, enum: ['Tarjeta de identidad', 'Cedula'], required: true },
  foto: { type: String },
});

module.exports = mongoose.model('User', userSchema);
