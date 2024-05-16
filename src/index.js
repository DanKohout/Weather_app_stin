const path = require('path')
const express = require('express')
const hbs = require('hbs')


const app = express()
const port = process.env.PORT || 3000

const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

app.use(express.static(publicDirectoryPath))



app.get('', (req, res) => {
    res.render('index', {
        name: 'Daniel Kohout'
    })
})




app.get('*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'Dakoh Kodah',
        errorMessage: 'Page not found'
    })
})


app.listen(port, () => {
    console.log('server is running on port '+ port)
})
