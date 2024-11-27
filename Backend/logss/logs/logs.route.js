const express = require('express');
const router = express.Router();
const { queryLogs } = require('./logs.controller');
//const { createLog } = require('./logs.actions');

// Ruta para consultar logs
router.get('/', queryLogs);
//router.post('/create', createLog);

module.exports = router;