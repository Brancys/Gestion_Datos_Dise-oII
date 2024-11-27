const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
    action: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    nroDocumento: { type: String, required: true },
    tipoDocumento: { type: String, required: true },
    details: { type: mongoose.Schema.Types.Mixed }
  });

module.exports = mongoose.model('Log', logSchema);
