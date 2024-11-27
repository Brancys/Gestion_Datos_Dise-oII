const Log = require('./logs.model');

// Acción para consultar logs
async function getLogsBd(filters) {
  try {
    const logs = await Log.find(filters);
    return logs;
  } catch (error) {
    throw new Error(error.message);
  }
};
// async function getUserByNroDocumento(nroDocumento) {
//   try {
//     const user = await User.findOne(nroDocumento);
//     return user;
//   } catch (error) {
//     throw new Error(error.message);
//   }
// }

module.exports = { getLogsBd };