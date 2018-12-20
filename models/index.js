/**
 * Models is where all of the Schemas are defined for MongoDB / Mongoose
 * TODO: When new Schemas are needed, 
 */

const mongoose = require('mongoose')
const crypto = require('../util').crypto
const isEmail = require('../util').validate.isEmail

/**
 * BlogSchema defines how a blog post is stored in MongoDB
 */
const BlogSchema = require('./BlogModel')
const UserSchema = require('./UserModel')

// Define the model in mongoose
const User = mongoose.model('users', UserSchema)
const Blog = mongoose.model('blog', BlogSchema)
// Export the models
module.exports  = {
    User,
    Blog
}