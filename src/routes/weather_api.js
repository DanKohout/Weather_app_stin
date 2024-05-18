const router = require("express").Router()
const {weather} = require('../utils/weather.js')

/*router.post('/weather', (req, res)=>{

    res.send({
        response: "hello"
    })
    /*weather.forecast_city("prague", (error, forecastData) => {
        if(error){
            return console.log('Error:', error)
        }
        res.json({
            response: forecastData
        })
        console.log('Data:', forecastData)
    })*/
//})



module.exports = router