/**
 * Models is where all of the Schemas are defined for MongoDB / Mongoose
 * TODO: When new Schemas are needed, 
 */

const mongoose = require('mongoose')

/**
 * BlogSchema defines how a blog post is stored in MongoDB
 */
const BlogSchema = require('./BlogModel')
const UserSchema = require('./UserModel')
const IPSchema = require('./IPModel')

// Define the model in mongoose
const User = mongoose.model('users', UserSchema)
const Blog = mongoose.model('blog', BlogSchema)
const IP = mongoose.model('ip', IPSchema)

// Export the models
module.exports  = {
    User,
    Blog,
    IP
}