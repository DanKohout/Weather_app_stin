const app = require('./app')
const forecast = require('./utils/weather.js')

const port = process.env.PORT || 3000

/**
 * This function only prints the port number
 */
app.listen(port, () => {
    console.log('server is running on port ' + port)
})

const path = require('path')
const express = require('express')
const hbs = require('hbs')

const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

app.use(express.static(publicDirectoryPath))



app.get('', (req, res) => {
    res.status(200).render('index', {
        name: 'Daniel Kohout'
    })
})


app.get('/hello', (req, res) => {
    res.status(200).json({ message: 'Hello, world!' })
})


app.get('/weather', (req, res) => {
    if (!req.query.address) {
        return res.send({
            error: 'You must provide an address!'
        })
    }
    forecast.forecast_city(req.query.address, (error, forecastData) => {
        if (error) {
            return console.log('Error:', error)
        }
        console.log('Data:', forecastData)
        res.send({
            forecast: forecastData,
        })
    })
    
})

app.get('*', (req, res) => {
    res.status(404).render('404', {
        title: '404',
        name: 'Dakoh Kodah',
        errorMessage: 'Page not found'
    })
})




/*app.get('/weather', (req, res) => {

    if (!req.query.address) {
        return res.send({
            error: 'You must provide an address!'
        })
    }
    forecast.forecast_city("prague", (error, forecastData) => {
        if (error) {
            return console.log('Error:', error)
        }
        console.log('Data:', forecastData)
    })

    forecast(latitude, longitude, (error, forecastData) => {
        if (error) {
            return res.send({ error })
        }

        res.send({
            forecast: forecastData,
            location,
            address: req.query.address
        })
    })

})*/
/*
forecast.forecast_city("prague", (error, forecastData) => {
    if(error){
        return console.log('Error:', error)
    }
    console.log('Data:', forecastData)
})
*/
