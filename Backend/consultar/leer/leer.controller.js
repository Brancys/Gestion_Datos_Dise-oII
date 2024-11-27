// src/controllers/queryController.js
const { getUsersBd, getUserByNroDocumento } = require('./leer.actions');

// Controlador para consultar usuarios
async function queryUsers(req, res) {
  const { nroDocumento, tipoDocumento, genero, startDate, endDate } = req.query;

  let filter = {};

  if (nroDocumento) {
    filter.nroDocumento = nroDocumento;
  }

  if (tipoDocumento) {
    filter.tipoDocumento = tipoDocumento;
  }

  if (genero) {
    filter.genero = genero;
  }

  // Agregar filtro por rango de fecha de nacimiento si se proporcionan ambas fechas
  if (startDate && endDate) {
    filter.fechaNacimiento = {
      $gte: new Date(startDate), // $gte significa "mayor que o igual a"
      $lte: new Date(endDate)   // $lte significa "menor que o igual a"
    };
  } else if (startDate) { // Solo fecha de inicio
    filter.fechaNacimiento = { $gte: new Date(startDate) };
  } else if (endDate) { // Solo fecha de finalización
    filter.fechaNacimiento = { $lte: new Date(endDate) };
  }

  try {
    const users = await getUsersBd(filter);
    res.status(200).json(users);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


async function findUser(req, res) {
  const nroDocumento = req.params;

  try {
    const user = await getUserByNroDocumento(nroDocumento);
    if (!user) {
      return res.status(404).send('Usuario no encontrado');
    }
    res.json(user);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

module.exports = { queryUsers, findUser };