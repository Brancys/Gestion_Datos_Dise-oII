const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");


const app = express();
const API_KEY = process.env.OPENAI_API_KEY;
app.use(cors());

app.get('/toponimia', async (req, res) => {
    const { nombre } = req.query;

    if (!nombre) {
        return res.status(400).json({ error: 'El parámetro "nombre" es requerido' });
    }

    try {

        const genAI = new GoogleGenerativeAI(process.env.API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `Devuelve la toponimia del nombre "${nombre}" en maximo 30 palabras.`;
        

        const result = await model.generateContent(prompt);

        res.json(result.response.text());
    } catch (error) {
        console.error('Error al obtener la información de OpenAI:', error);
        res.status(500).json({ error: 'Error al obtener información de OpenAI' });
    }
});

app.listen(3020, () => {
    console.log("Microservicio topinimia corriendo en el puerto 3020");
});
