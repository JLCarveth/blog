/**
 * @module auth - A JWT wrapper module
 * @author John L. Carveth
 * @requires jwt
 * @callback requestCallback (error, data) as parameters
 */

const jwt = require('jsonwebtoken')

/**
 * @function generateToken
 * Generates a token for an authenticated user.
 * @param {String} id - The ObjectID of the user being authenticated 
 * @param {String} role - the users role
 * @param {function} requestCallback - Handles the function response.
 */
const generateToken = function (email, role, callback) {
    const issuedAt = new Date().getTime()
    // Expiry is 24h from issuedAt
    const expiry = generateExpiry()
    const payload = {
        "email" : email,
        "exp": expiry,
        "role": role
    }
    jwt.sign(payload, process.env.secretKey, {
        algorithm : "HS512"
    }, (error, token) => {
        if (error) {
            callback({
                error:error,
                message:"Error generating token"
            })
        } else { 
            callback(null, token)
        }
    })
}

/**
 * @private
 * @function generateExpiry
 * Generates a Date object 1 hour from the current time.
 * @return {Date} the expiry date
 */
const generateExpiry = function () {
    const issuedAt = new Date()
    return new Date(Date.parse(issuedAt) + 3600000)
} 

/**
 * @function verifyJWT
 * Unpacks the provided JWT, or callbacks an error if it's not valid
 * @param {String} token - The token to be verified
 * @param {requestCallback} callback - Handles the function response
 */
const verifyJWT = function(token, callback) {
    return jwt.verify(token, process.env.secretKey, {}, (error, decoded) => {
        if (error) callback({error:"Error decoding JWT"})
        else {
            // Check the token is not expired
            if (isExpired(decoded.exp)) {
                callback({
                    success: false,
                    error: 'Token has expired. Please re-authenticate.'
                })
            }else callback(null, decoded)
        }
    })
}

/**
 * Verifies if a token has expired
 * @param {*} expiry JWT.exp variable
 * @return true if the token is expired
 */
const isExpired = function (expiry) {
    const now = new Date()
    return !(expiry - Date.parse(now)) > 0
}

module.exports = {
    generateToken,
    verifyJWT,
    generateExpiry
}