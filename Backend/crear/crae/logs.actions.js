const Log = require('./logs.model');

// Acción para registrar un log
async function createLog(action, userId, nroDocumento, tipoDocumento) {
  try {
    //const { action, userId, nroDocumento, tipoDocumento } = req.body;
    console.log('action', action);
    const log = new Log({ action, userId, nroDocumento, tipoDocumento });
    await log.save();
    //return res.status(200).json(log);
    return log;
  } catch (error) {
    throw new Error(error.message);
  }
};



module.exports = { createLog };