/**
 * Dependencies
 */
const crypto = require('./util').crypto
const express = require('express')
const app = express();
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')

/**
 * Database connections and secret keys
 * @private
 */
const config = require('./config')

const tokenValidator = require('./middlewares').AuthWare

// Apply the token validator middleware to all requests on '/api'
app.use('/api/', tokenValidator)

const mongoose = require('mongoose')
mongoose.connect(process.env.mongodbURI, {useNewUrlParser:true}, (error) => {
    if (error) {
        throw error
    }
})

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended:true
}))

// Initiate the routes that don't need auth
const routes = require('./routes')(app)

/**
 * All routes through /api/ require client authentication in the form of a JSON Web Token (JWT)
 */
app.post('/api/', (req,res) => {
    res.send('Validated...')
})

app.listen(3000, () => {
    console.log('Listening...')
})


