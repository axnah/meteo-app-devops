// src/server.js
const app = require('./index');
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`MeteoApp API démarrée sur http://localhost:${PORT}`);
  console.log(`Métriques Prometheus disponibles sur http://localhost:${PORT}/metrics`);
});