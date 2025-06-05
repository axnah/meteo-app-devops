// __tests__/app.test.js
const request = require('supertest');
const app = require('../src/index'); // Importer l'application Express

describe('MeteoApp API', () => {
  describe('GET /', () => {
    it('should return 200 OK with a welcome message', async () => {
      const res = await request(app).get('/');
      expect(res.statusCode).toEqual(200);
      expect(res.text).toContain('Bienvenue sur MeteoApp API!');
    });
  });

  describe('GET /weather', () => {
    it('should return 400 if city parameter is missing', async () => {
      const res = await request(app).get('/weather');
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('error', 'Le paramètre "city" est requis.');
    });

    it('should return 200 OK with weather data for a given city', async () => {
      const cityName = 'Londres';
      const res = await request(app).get(`/weather?city=${cityName}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('city', cityName);
      expect(res.body).toHaveProperty('temperature');
      expect(res.body).toHaveProperty('description');
    });
  });

  describe('GET /metrics', () => {
    it('should return 200 OK and Prometheus metrics', async () => {
      const res = await request(app).get('/metrics');
      expect(res.statusCode).toEqual(200);
      expect(res.headers['content-type']).toEqual('text/plain; version=0.0.4; charset=utf-8');
      expect(res.text).toContain('nodejs_heap_size_total_bytes'); // Une métrique par défaut
      expect(res.text).toContain('meteoapp_weather_requests_total'); // Notre métrique custom
    });
  });
});