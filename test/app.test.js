
const request = require('supertest');
const app = require('../src/app');
require('../src/index.js');
//const forecast = require('../src/utils/weather.js');
const { forecast_city, historical_weather } = require('../src/utils/weather.js');
const cookieParser = require('cookie-parser');


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

describe('GET /login', () => {
    it('responds with JSON message', async () => {
        const response = await request(app).get('/login');
        //console.log('Response body:', response.text);
        expect(response.status).toBe(200);
        expect(response.text).toContain('<h1>Login</h1>');
    });
});

describe('GET /signup', () => {
    it('responds with JSON message', async () => {
        const response = await request(app).get('/signup');
        //console.log('Response body:', response.text);
        expect(response.status).toBe(200);
        expect(response.text).toContain('<h1>Signup</h1>');
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
        forecast_city.mockImplementation((address, callback) => {
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
        forecast_city.mockImplementation((address, callback) => {
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




describe('GET /subscription/weather', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    const authenticatedRequest = () => request(app).get('/subscription/weather').set('Cookie', 'username=testuser');

    it('should return 401 Unauthorized if not authenticated', async () => {
        const response = await request(app).get('/subscription/weather');
        expect(response.status).toBe(401);
    });

    it('should return error if no address or date is provided', async () => {
        //const response = await request(app).get('/subscription/weather');
        const response = await authenticatedRequest();
        
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ error: 'You must provide an address!' });
    });

    it('should return error if no date is provided', async () => {
        //const response = await request(app).get('/subscription/weather').query({ address: 'Prague' });
        const response = await authenticatedRequest().query({ address: 'Prague' });
        
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ error: 'You must provide an date!' });
    });

    it('should return historical weather data for a valid address and date', async () => {
        const mockHistData = {
            location: { name: 'Prague' },
            forecast: [
                {
                    date: '2024-05-20',
                    avgtemp_c: 16.9,
                    condition: {
                        text: 'Patchy light rain with thunder',
                        icon: '//cdn.weatherapi.com/weather/64x64/day/386.png',
                        code: 1273
                    }
                }
            ]
        };
        historical_weather.mockImplementation((apiKey, address, date, callback) => {
            callback(null, mockHistData);
        });

        //const response = await request(app).get('/subscription/weather').query({ address: 'Prague', date: '2024-05-20' });
        const response = await authenticatedRequest().query({ address: 'Prague', date: '2024-05-20' });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('location');
        expect(response.body.location).toHaveProperty('name');
        expect(response.body.location.name).toBe('Prague');
    });

    it('should handle errors from the weather API', async () => {
        historical_weather.mockImplementation((apiKey, address, date, callback) => {
            callback('Unable to find location', undefined);
        });

        //const response = await request(app).get('/subscription/weather').query({ address: 'InvalidCity', date: '2024-05-20' });
        const response = await authenticatedRequest().query({ address: 'InvalidCity', date: '2024-05-20' });


        expect(response.status).toBe(200);
        expect(response.body).toEqual({ response: 'err' });
    });
});

describe('GET /subscription', () => {
    it('should return 401 Unauthorized if not authenticated', async () => {
        const response = await request(app).get('/subscription');
        expect(response.status).toBe(401);
    });

    it('should render the subscription page if authenticated', async () => {
        const response = await request(app).get('/subscription').set('Cookie', 'username=testuser');
        expect(response.status).toBe(200);
        expect(response.text).toContain('<h1>Weather App - subscription version</h1>');
    });
});



describe('GET /blab', () => {
    it('responds with JSON message', async () => {
        const response = await request(app).get('/*');
        expect(response.status).toBe(404);
    });
});

