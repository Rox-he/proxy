const express = require('express');
const fetch = require('node-fetch'); // Versión 2.x para CommonJS
const app = express();

app.use(express.json());

const PORT = process.env.PORT || 3000;

// Cambia esta URL por la URL HTTPS de tu API en Railway
const RAILWAY_URL = 'https://servidor-iot-production-348d.up.railway.app/post-data';

app.post('/post-data', async (req, res) => {
  try {
    const response = await fetch(RAILWAY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();
    res.status(response.status).json(data)
  } catch (error) {
    console.error('Error en proxy:', error);
    res.status(500).send('Error en el proxy');
  }
});

app.listen(PORT, () => {
  console.log(`Proxy HTTP escuchando en puerto ${PORT}`);
});
