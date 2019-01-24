/**
 * @module models/UserModel
 * @author John L. Carveth
 * A mongoose model for defining how user data is stored/
 */

 // Dependencies
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const crypto = require('../util/crypto')

/**
 * @private
 * @function isEmail
 * @param {String} email - the email address to verify 
 */
const isEmail = function (email) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
}
/**
 * Defines how a user is stored in MongoDB/Mongoose
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
    role: {
        type: String,
        default: 'user'
    }
})

/**
 * @callback requestCallback - for handling the function response
 */
/**
 * @function authenticate
 * Authenticates a login attempt. Now returns the users role if successful.
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
                if (result) {
                    callback(null, {
                        role: user.role
                    })
                } else callback({success:false, message:"Authentication Failed."})
            } else {
                callback({
                    success: false,
                    message: 'No such user was found.'
                })
            }
        }
    })
}

module.exports = UserSchema