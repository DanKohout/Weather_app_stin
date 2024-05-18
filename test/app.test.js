
const request = require('supertest');
const app = require('../src/app');
require('../src/index.js');
const forecast = require('../src/utils/weather.js');


jest.mock('../src/utils/weather.js')



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

describe('GET /weather', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return error if no address is provided', async () => {
        const response = await request(app).get('/weather');

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            error: 'You must provide an address!'
        });
    });

    it('should return forecast data for a valid address', async () => {
        const mockForecastData = { temperature: 20, description: 'Sunny' };
        forecast.forecast_city.mockImplementation((address, callback) => {
            callback(null, mockForecastData);
        });

        const response = await request(app).get('/weather').query({ address: 'Prague' });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('forecast');
        expect(response.body.forecast).toHaveProperty('temperature');
        expect(response.body.forecast).toHaveProperty('description');
    });

    it('should return city not found', async () => {
        const mockForecastData = { cod: 404, message:'city not found' };
        forecast.forecast_city.mockImplementation((address, callback) => {
            callback(null, mockForecastData);
        });
    
        const response = await request(app).get('/weather').query({ address: 'pr' });
    
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('forecast');
        expect(response.body).toEqual({
            forecast: mockForecastData
        });
      });
});


describe('GET /blab', () => {
    it('responds with JSON message', async () => {
        const response = await request(app).get('/*');
        expect(response.status).toBe(404);
    });
});