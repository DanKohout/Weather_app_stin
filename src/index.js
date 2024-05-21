const app = require('./app')
const forecast = require('./utils/weather.js')
const handleSignup = require('./user_actions/signup.js');
const handleLogin = require('./user_actions/login.js');
const cookieParser = require('cookie-parser');
const authMiddleware = require('./utils/auth_middleware');
app.use(cookieParser());


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


/**
 * HOME page
 */
app.get('', (req, res) => {
    res.status(200).render('index', {
        name: 'Daniel Kohout'
    })
})
/**
 * Login page
 */
app.get('/login', (req, res) => {
    res.status(200).render('login', {
        name: 'Daniel Kohout'
    })
})
/**
 * Sign up page
 */
app.get('/signup', (req, res) => {
    res.status(200).render('signup', {
        name: 'Daniel Kohout'
    })
})
/**
 * page for premium users, similar to Home page, but with more stuff
 * if no cookies of username are found, it will return 401
 */
app.use('/subscription', authMiddleware);
app.get('/subscription', (req, res) => {
    const { username } = req.cookies;
    res.status(200).render('subscription', {
        name: 'Daniel Kohout',
        user: username
    })
})

/**
 * hello world (not needed)
 */
app.get('/hello', (req, res) => {
    res.status(200).json({ message: 'Hello, world!' })
})

/**
 * communication with weather API -> returns the json from the API
 */
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
        //console.log('Data:', forecastData)
        res.send({
            forecast: forecastData,
        })
    })

})


/**
 * Route to handle user signup
 */
app.post('/signup/user', handleSignup);


/**
 * Route to handle user login
 */
app.post('/login/user', handleLogin);





/**
 * custom 404 page
 */
app.get('*', (req, res) => {
    res.status(404).render('404', {
        title: '404',
        name: 'Dakoh Kodah',
        errorMessage: 'Page not found'
    })
})



