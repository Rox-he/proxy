const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para parsear application/x-www-form-urlencoded (necesario para SIM800L)
app.use(express.urlencoded({ extended: true }));

// Middleware para manejo de conexiones
app.use((req, res, next) => {
  // Desactivar redirección HTTPS para SIM800L
  if (req.headers['user-agent'] && req.headers['user-agent'].includes('SIM800L')) {
    return next();
  }
  // Redirección normal para otros clientes
  if (req.headers['x-forwarded-proto'] !== 'https') {
    return res.redirect(307, 'https://' + req.headers.host + req.url);
  }
  next();
});

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('Servidor Express funcionando correctamente');
});

// Endpoint para recibir datos del SIM800L
app.post('/post-data', async (req, res) => {
  console.log("📨 Headers recibidos:", req.headers); // Log de diagnóstico
  console.log("📨 Datos recibidos:", req.body);

  const { api_key, value1, value2 } = req.body;

  // Validación de datos
  if (!api_key || !value1 || !value2) {
    console.error("Datos incompletos recibidos:", req.body);
    return res.status(400).send('Datos incompletos');
  }

  try {
    // Redirigir la solicitud a tu API en Railway
    const response = await axios.post(
      'http://servidor-iot-production-348d.up.railway.app/post-data',
      {
        api_key: api_key,
        value1: value1,
        value2: value2
      },
      { 
        headers: { 'Content-Type': 'application/json' },
        timeout: 10000 // 10 segundos timeout
      }
    );
    
    console.log("✅ Respuesta de Railway:", response.data);
    res.status(200).send('Datos procesados: ' + JSON.stringify(response.data));
  } catch (error) {
    console.error("❌ Error completo:", error);
    const errorMessage = error.response 
      ? `Error ${error.response.status}: ${error.response.data}`
      : error.message;
    res.status(500).send('Error: ' + errorMessage);
  }
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Intermediario escuchando en puerto ${PORT}`);
});