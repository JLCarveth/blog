/**
 * @module models/UserModel
 * @author John L. Carveth
 * A mongoose model for defining how user data is stored/
 */

 // Dependencies
const mongoose = require('mongoose')
const Schema = mongoose.Schema

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
        required: true,
        unique: true
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
    },
    verified: {
        type: Boolean,
        default: false
    }
})

module.exports = UserSchema