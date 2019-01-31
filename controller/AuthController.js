/**
 * @module AuthController
 * @author John L. Carveth
 * This file handles all login behaviours such as:
 * - Authentication
 * - Registration
 * - Changing user password
*/

const crypto = require('../util').crypto
const auth = require('../util').auth
const UserModel = require('../models').User

/**
 * @callback requestCallback (error, data) as parameters
 */

/**
 * @var failures tracks failed login attempts
 */
var failures = new Map()

/**
 * @function authenticateUser
 * Authenticates credentials provided by a client against the MongoDB / Mongoose Collections
 * If the user was authenticated successfully, a JWT is sent back as result in callback()
 * Also tracks failed attempts
 * @param {string} email - The email of the user trying to authenticate
 * @param {sring} password - The password of the user trying to authenticate
 * @param {function} requestCallback - Handles the response
 */
module.exports.authenticateUser = function (ip, email, password, callback) {
    if (failures.get(ip) != null) {
        var fail = failures.get(ip)
        var now = new Date()
        // If the IP has already failed 3 times this hour...
        if (fail.attempts >= 3) {
            callback('Too many failed attempts. Try again later.')
            return;
        } else if ((now - fail.lastFailure) > 3600000) { // Last failed attempt was over an hour ago
            failures.delete(ip)
        }
    }

    UserModel.findOne({'email':email}, (error, result) => {
        if (error) callback(error)
        else {
            valid = crypto.validateInput(password, result.password, result.salt)
            if (!valid) {
                // If the authentication failed (incorrect credentials)
                if (failures.get(ip) == null) { // Assuming first failure
                    failures.set(ip, {attempts:0, lastFailure:new Date()})
                }
                params = failures.get(ip)
                params.attempts++
                params.lastFailure = new Date()
                failures.set(ip, params)
                callback('Authentication failed.')
            } else {
                auth.generateToken(result.email, result.role, (error,result) => {
                    if (error) callback(error)
                    else callback(null, result)
                })
            }
        }
    })
}

/**
 * @function
 * Registeres a User to the MongoDB / Mongoose Collection
 * @param {string} email - the email of the user wishing to register
 * @param {string} username - the chosen username of the user
 * @param {string} password - the user's password
 * @param {requestCallback} callback - the callback that handles the response
 */
module.exports.registerUser = function (email, username, password, callback) {
    const hashObj = crypto.hashPassword(password)
    const salt = hashObj.salt
    UserModel.create({
        email: email,
        username: username,
        password: hashObj.hash,
        salt: salt
    }, (error, user) => {
        if (error) {
            callback({error:'Error creating user.'})
        }
        else callback(null, user) // TODO Send the verification email
    })
}

/**
 * @function
 * Changes a registered user's password, if proper authentication is provided.
 * @param {string} email - the email of the user whose password will change
 * @param {string} newPassword - the new password for user
 * @param {requestCallback} callback - handles the response
 */
module.exports.changePassword = function (email, newPassword, callback) {
    UserModel.findOne({email : email}, (error, user) => {
        if (error) callback(error)
        else {
            const hashObj = crypto.hashPassword(newPassword)
            if (hashObj.hash == user.password) {
                UserModel.update({email:email}, {
                    password:hashObj.hash,
                    salt:hashObj.salt
                }, (error, result) => {
                    if (error) callback({error:'Error updating user entry.'})
                    else callback({
                        message: 'Password changed successfully.'
                    })
                })
            }

        }
    })
}

/**
 * @function
 * Verifies that the email exists in the database (belongs to a user)
 * @param {string} email - the email address to verify
 * @param {requestCallback} callback - handles the function response, params error, boolean
 */
module.exports.checkEmail = function (email, callback) {
    if (!email) {
        return callback({error: 'Email was not provided'})
    }

    UserModel.findOne({email:email}, (error, user) => {
        if (error) return callback(error)
        if (!email) return callback({
            error: 'Email does not exist'
        })
        if (user.email == email) {
            callback(null, true)
        } else {
            callback(null, false)
        }
    })
}

/**
 * @function getUserEmail
 * Gets the ObjectID associated with the given email address, if it exists within
 * the collection.
 * @param {string} email - The email address of the user
 * @param {requestCallback} callback - Handles the function response. 
 */
module.exports.getUserEmail = function (email, callback) {
    UserModel.findOne({email:email}, (error, result) => {
        if (error) callback(error)
        else {
            const id = result._id
            console.log("[getUserEmail] " + id)
            callback(null, id)
        }
    })
}

/**
 * @function deleteUser
 * Removes a user from the MongoDB collection
 * @param {String} email - the email of the user to remove
 * @param {requestCallback} callback - handles function response.
 */
module.exports.deleteUser = function (email, callback) {
    UserModel.deleteOne({email:email}, (error) => {
        if (error) callback(error)
        else callback(null, {
            message: 'User deleted successfully.',
            sucesss: true
        })
    })
}

/**
 * @function verifyUser
 * Verifies a user account, so they can perform actions
 * @param {String} code - the unique code used for verification
 * @param {requestCallback} callback - handles the function response
 */
module.exports.verifyUser = function (code, callback) {
    UserModel.findOneAndUpdate({'_id': {$regex: /code/}}, {'verified':true}, (error, result) => {
        if (error) callback(error)
        else callback(null, result)
    })
}

/**
 * @function sendVerificationCode
 * Sends a code to a unverified user's email, proving they own the email address.
 * @param {String} code - the 
 */
module.exports.sendVerificationCode = function (code, callback) {

}