const request = require('postman-request')
const axios = require('axios');

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


/**
 * method that with location and date gives you info about weather on that day
 * ps. the api in free version has only 7 day history available!
 */
const historical_weather = (apiKey, location, date, callback) => {

  apiKey = '9b636686bc9c4e17b69151504242105'

  const today = new Date();
  const requestedDate = new Date(date);
  const differenceInDays = (today - requestedDate) / (1000 * 60 * 60 * 24);

  if (differenceInDays > 6 || differenceInDays < 0 ) {
    return callback('Date is more than 6 days in the past. History API supports only up to 7 days.', undefined);
  }

  const url = `http://api.weatherapi.com/v1/history.json?key=${apiKey}&q=${location}&dt=${date}`

  axios.get(url)
    .then(response => {
      const filteredData = extractWeatherData(response.data)
      callback(undefined, filteredData)
    })
    .catch(error => {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        callback(`Unable to find location: ${error.response.data.error.message}`, undefined)
      } else if (error.request) {
        // The request was made but no response was received
        callback('Unable to connect to weather service!', undefined)
      } else {
        // Something happened in setting up the request that triggered an Error
        callback('Error: ' + error.message, undefined)
      }
    })
}



/**
 * extracting only some info from historical_weather api call
 * @param {*} data 
 * @returns 
 */
const extractWeatherData = (data) => {
  const locationName = data.location.name
  const forecastData = data.forecast.forecastday.map(day => ({
    date: day.date,
    avgtemp_c: day.day.avgtemp_c,
    condition: day.day.condition
  }))

  return {
    location: {
      name: locationName
    },
    forecast: forecastData
  }
}

const getTodayDate = () => {
  const today = new Date()
  const year = today.getFullYear()
  const month = (today.getMonth() + 1).toString().padStart(2, '0')
  const day = today.getDate().toString().padStart(2, '0')
  return `${year}-${month}-${day}`
}


//exports.forecast_geolocation = forecast_geolocation
module.exports = {
  forecast_city,
  historical_weather
}
