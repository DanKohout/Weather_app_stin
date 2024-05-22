const nock = require('nock');
const { forecast_city, historical_weather } = require('../src/utils/weather');

describe('forecast_city', () => {
  const weatherURL = 'https://api.openweathermap.org';
  const apiPath = '/data/2.5/weather';
  const apiKey = '0fed44c7b98eaf08e38d1d2cb18b346a';

  afterEach(() => {
    nock.cleanAll();
  });

  it('should return weather data for a valid city', (done) => {
    const city = 'Prague';
    const mockResponse = {
      weather: [{ description: 'clear sky' }],
      main: { temp: 25 }
    };

    nock(weatherURL)
      .get(apiPath)
      .query({ units: 'metric', appid: apiKey, q: city })
      .reply(200, mockResponse);

    forecast_city(city, (error, data) => {
      expect(error).toBeUndefined();
      expect(data).toEqual(mockResponse);
      done();
    });
  });

  it('should return an error message for an invalid city', (done) => {
    const city = 'InvalidCity';
    const mockErrorResponse = {
      cod: '404',
      message: 'city not found'
    };

    nock(weatherURL)
      .get(apiPath)
      .query({ units: 'metric', appid: apiKey, q: city })
      .reply(404, mockErrorResponse);

    forecast_city(city, (error, data) => {
      //expect(error).toBe('Unable to find location ' + mockErrorResponse.message);
      //expect(data).toBeUndefined();
      expect(data).toEqual(mockErrorResponse);
      done();
    });
  });

  it('should handle network errors', (done) => {
    const city = 'Prague';

    nock(weatherURL)
      .get(apiPath)
      .query({ units: 'metric', appid: apiKey, q: city })
      .replyWithError('Network error');

    forecast_city(city, (error, data) => {
      expect(error).toBe('unable to connect to weather service!');
      expect(data).toBeUndefined();
      done();
    });
  });
});


describe('historical_weather', () => {
  const weatherURL = 'http://api.weatherapi.com';
  const apiPath = '/v1/history.json';
  const apiKey = '9b636686bc9c4e17b69151504242105';

  afterEach(() => {
    nock.cleanAll();
  });

  it('should return historical weather data for a valid date within the past 6 days', (done) => {
    const location = 'Prague';
    const date = new Date();
    date.setDate(date.getDate() - 1); // 1 day ago
    const formattedDate = date.toISOString().split('T')[0];
    const mockResponse = {
      location: { name: 'Prague' },
      forecast: {
        forecastday: [
          {
            date: formattedDate,
            day: {
              avgtemp_c: 18,
              condition: {
                text: 'Patchy light rain with thunder',
                icon: '//cdn.weatherapi.com/weather/64x64/day/386.png',
                code: 1273
              }
            }
          }
        ]
      }
    };

    nock(weatherURL)
      .get(apiPath)
      .query({ key: apiKey, q: location, dt: formattedDate })
      .reply(200, mockResponse);

    historical_weather(apiKey, location, formattedDate, (error, data) => {
      expect(error).toBeUndefined();
      expect(data).toEqual({
        location: { name: 'Prague' },
        forecast: [
          {
            date: formattedDate,
            avgtemp_c: 18,
            condition: {
              text: 'Patchy light rain with thunder',
              icon: '//cdn.weatherapi.com/weather/64x64/day/386.png',
              code: 1273
            }
          }
        ]
      });
      done();
    });
  });

  it('should return an error for a date more than 6 days in the past', (done) => {
    const location = 'Prague';
    const date = new Date();
    date.setDate(date.getDate() - 7); // 7 days ago
    const formattedDate = date.toISOString().split('T')[0];

    historical_weather(apiKey, location, formattedDate, (error, data) => {
      expect(error).toBe('Date is more than 6 days in the past. History API supports only up to 7 days.');
      expect(data).toBeUndefined();
      done();
    });
  });

  it('should return an error message if unable to find location', (done) => {
    const location = 'InvalidLocation';
    const date = new Date();
    date.setDate(date.getDate() - 1); // 1 day ago
    const formattedDate = date.toISOString().split('T')[0];
    const mockErrorResponse = {
      error: {
        message: 'No matching location found.'
      }
    };

    nock(weatherURL)
      .get(apiPath)
      .query({ key: apiKey, q: location, dt: formattedDate })
      .reply(400, mockErrorResponse);

    historical_weather(apiKey, location, formattedDate, (error, data) => {
      expect(error).toBe('Unable to find location: No matching location found.');
      expect(data).toBeUndefined();
      done();
    });
  });

  it('should handle network errors', (done) => {
    const location = 'Prague';
    const date = new Date();
    date.setDate(date.getDate() - 1); // 1 day ago
    const formattedDate = date.toISOString().split('T')[0];

    nock(weatherURL)
      .get(apiPath)
      .query({ key: apiKey, q: location, dt: formattedDate })
      .replyWithError('Network error');

    historical_weather(apiKey, location, formattedDate, (error, data) => {
      expect(error).toBe('Unable to connect to weather service!');
      expect(data).toBeUndefined();
      done();
    });
  });
});

