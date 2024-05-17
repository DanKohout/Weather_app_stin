
const request = require('supertest');
const app = require('../src/app');
require('../src/index.js');



describe('GET /', () => {
    it('responds with JSON message', async () => {
        const response = await request(app).get('/');
        //console.log('Response body:', response.text);
        expect(response.status).toBe(200);
        expect(response.text).toContain('<h1>Weather App</h1>');
    });
});

describe('GET /hello', () => {
    it('responds with JSON message', async () => {
        const response = await request(app).get('/hello');
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ message: 'Hello, world!' });
    });
});




describe('GET /blab', () => {
    it('responds with JSON message', async () => {
        const response = await request(app).get('/*');
        expect(response.status).toBe(404);
    });
});