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
 * @function authenticateUser
 * Authenticates credentials provided by a client against the MongoDB / Mongoose Collections
 * If the user was authenticated successfully, a JWT is sent back as result in callback()
 * @param {string} email - The email of the user trying to authenticate
 * @param {sring} password - The password of the user trying to authenticate
 * @param {function} requestCallback - Handles the response
 */
module.exports.authenticateUser = function (email, password, callback) {
    UserModel.authenticate(email, password, (error, result) => {
        if (error) { callback(error) }
        else if (result) {
            console.log('Result was true, were authenticated')
            // Store the returned role in the token
            const token = auth.generateToken(email, result.role, (error, token) => {
                if (error) callback(error)
                else callback(null,token)
            })
        } else callback({error: "Invalid email address or password."})
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
        else callback(null, user)
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