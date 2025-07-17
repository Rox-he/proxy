const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para parsear application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

app.post('/post-data', async (req, res) => {
  const { api_key, value1, value2 } = req.body;
  console.log("📨 Datos recibidos del SIM800L:", req.body);

  if (!api_key || !value1 || !value2) {
    return res.status(400).send('Datos incompletos');
  }

  try {
    // Redirigir la solicitud a tu API en Railway
    const response = await axios.post(
      'https://servidor-iot-production-348d.up.railway.app/post-data',
      { api_key, value1, value2 },
      { headers: { 'Content-Type': 'application/json' } }
    );

    console.log("Respuesta de Railway:", response.data);
    res.send('Datos enviados a Railway');
  } catch (error) {
    console.error("Error al reenviar a Railway:", error.message);
    res.status(500).send('Error reenviando a Railway');
  }
});
app.get('/', (req, res) => {
  res.send('Servidor Express funcionando correctamente');
});

app.listen(PORT, () => {
  console.log(`🚀 Intermediario escuchando en puerto ${PORT}`);
});
