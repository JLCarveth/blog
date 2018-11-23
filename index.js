const crypto = require('./util').crypto
const express = require('express')
const app = express();
const bodyParser = require('body-parser')

const config = require('./config')

const tokenValidator = require('./util').validate.validateToken

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

app.post('/', (req,res) => {
    console.log('POST Request on /')
})

app.post('/api/check', (req,res) => {
    console.log('Hmmm..')
})

app.listen(3000, () => {
    console.log('Listening...')
})


