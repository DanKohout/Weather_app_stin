const request = require('postman-request')

/*const forecast_city_v1 = (city, callback) => {
  //weatherstack api - 250 requests/month -> risky
  //const url = 'http://api.weatherstack.com/current?access_key=ae81ec53a76a1aa69dea4d736c028c64&&query=' + city
  request({ url, json: true }, (error, { body }) => {
    if (error) {
      callback('unable to connect to weather service!', undefined)
    } else if (body.error) {
      callback('Unable to find location ' + body.error, undefined)
    } else {
      const { current } = body
      //callback(undefined, current.temperature + ' degrees. ' + current.weather_descriptions[0])
      callback(undefined, current)
    }
  })
}*/

const forecast_city = (city, callback) => {
  //openweathermap api - 1000 request/day
  weatherURL = 'https://api.openweathermap.org/data/2.5/weather?units=metric&appid=0fed44c7b98eaf08e38d1d2cb18b346a'
  urlString = weatherURL + "&q=" + city
  url = urlString

  request({ url, json: true }, (error, response) => {
    if (error) {
      callback('unable to connect to weather service!', undefined)
    } else if (response.body.error) {
      callback('Unable to find location ' + response.body.error, undefined)
    } else {
      callback(undefined, response.body)
    }

  })

}



//exports.forecast_geolocation = forecast_geolocation
exports.forecast_city = forecast_city
