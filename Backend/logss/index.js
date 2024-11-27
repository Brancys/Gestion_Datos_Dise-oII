const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();
require('dotenv').config();

app.use(cors());
app.use(express.json());
//let dbConnected = false;

mongoose.connect("mongodb+srv://brancysb:QPA1hy2HN2QBMJAJ@cluster0.sgvtt.mongodb.net/test?retryWrites=true&w=majority&appName=Cluster0")
    .then(() => {
        console.log("Conexión a MongoDB exitosa");
    })
    .catch(err => {
        console.error("Error al conectar a MongoDB:", err);
    });
//console.log(dbConnected);
// Middleware para verificar estado de la conexión
app.use((req, res, next) => {
    if (mongoose.connection.readyState != 1) {
        return res.status(503).json({ message: "El servicio de base de datos no está disponible" });
    }
    next();
});


app.get("/", (req, res) => {
    res.status(200).json({});
})

const logsRoutes = require("./logs/logs.route");
app.use('/logs', logsRoutes);


try {
    app.listen(3015);
    console.log("Servidor corriendo en el puerto 3015");
} catch (error) {
    console.log("Error al iniciar el servidor", error);
}

//app.listen(8080);

