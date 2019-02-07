/**
 * Dependencies
 */
const crypto = require('./util').crypto
const express = require('express')
const app = express();
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const mongoose = require('mongoose')
const cors = require('cors')

const seed = require('./util').seed
const seedData = require('./data.js')

/**
 * Database connections and secret keys
 * @private
 */
const config = require('./config')

const AuthWare = require('./middlewares').AuthWare
const IPFilterWare = require('./middlewares').IPFilterWare

// Allow cross-domain requests
app.use(cors())
app.options('*', cors())
// All requests must be filtered to check for banned IPs
app.use('*', new IPFilterWare())
// All requests to the API must be authenticated with a token.
app.use('/api/', AuthWare)
// To be able to read JSON data
app.use(bodyParser.json())
// To read body params
app.use(bodyParser.urlencoded({extended:true}))

// Seed the necessary data to MongoDB
const Seeder = new seed()
// Seed all initial data for the system
Seeder.connect(process.env.mongodbURI, {useNewUrlParser:true}, () => {
    // Seed the roles then sever the connection
    Seeder.seedData(seedData.roleData, () => {})
})

// To avoid the 'deprecated url parser' warning...
mongoose.connect(process.env.mongodbURI, {useNewUrlParser:true}, (error) => {
    if (error) {
        throw error
    }
})

// Initiate the other routes
const routes = require('./routes')(app)

app.listen(3000, () => {
    console.log('Listening...')
})


