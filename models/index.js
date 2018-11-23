/**
 * Models is where all of the Schemas are defined for MongoDB / Mongoose
 * TODO: When new Schemas are needed, 
 */

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const crypto = require('../util').crypto
const isEmail = require('../util').validate.isEmail

/**
 * UserSchema for Mongoose
 */
const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        validate: [isEmail, 'Please provide a valid email.']
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    salt: {
        type: String,
        required: true
    },
    admin: {
        type: Boolean,
        default: false
    }
})

/**
 * @callback requestCallback - for handling the function response
 */
/**
 * @param {string} email - the email address of the user trying to authenticate
 * @param {string} password - the password attempt
 * @param {requestCallback} callback - handles the response
 * 
 */
UserSchema.statics.authenticate = function (email, password, callback) {
    this.findOne({email:email}, function (error, user) {
        if (error) { callback({
            error: error,
            message: "User with that email address could not be found."
        })} else {
            if (user) {
                const result = crypto.validateInput(password, user.password, user.salt)
                callback(null, result)
            } else {
                callback({
                    error: "No such user was found."
                })
            }
        }
    })
}

// Define the model in mongoose
const User = mongoose.model('users', UserSchema)
// Export the models
module.exports  = {
    User
}