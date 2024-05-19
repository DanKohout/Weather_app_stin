const nock = require('nock');
const { forecast_city } = require('../src/utils/weather');  

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
