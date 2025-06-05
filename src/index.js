// src/index.js
const express = require('express');
const client = require('prom-client'); // Pour Prometheus

const app = express();
app.use(express.json()); // Pour parser le JSON dans les requêtes

// Initialiser prom-client pour collecter les métriques par défaut
const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics({ timeout: 5000 });

// Métrique custom : compteur pour le nombre de requêtes météo
const weatherRequestsCounter = new client.Counter({
  name: 'meteoapp_weather_requests_total',
  help: 'Total number of /weather requests',
  labelNames: ['city', 'status_code'], // Pour différencier par ville et code de statut
});

// Endpoint de base
app.get('/', (req, res) => {
  res.send('Bienvenue sur MeteoApp API!');
});

// Endpoint météo (simulé pour l'instant)
app.get('/weather', (req, res) => {
  const city = req.query.city;
  if (!city) {
    weatherRequestsCounter.labels('unknown', '400').inc();
    return res.status(400).json({ error: 'Le paramètre "city" est requis.' });
  }

  // Données météo simulées
  const mockWeatherData = {
    city: city,
    temperature: Math.floor(Math.random() * 30) + 5, // Température aléatoire entre 5 et 34°C
    description: 'Ensoleillé avec quelques nuages',
    humidity: Math.floor(Math.random() * 50) + 30, // Humidité aléatoire
    timestamp: new Date().toISOString(),
  };

  weatherRequestsCounter.labels(city.toLowerCase(), '200').inc();
  res.json(mockWeatherData);
});

// Endpoint pour les métriques Prometheus
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
});

module.exports = app; // Exporter l'app pour les tests et server.js