/**
 * Utility class for generating / verifying tokens
 */
const jwt = require('jsonwebtoken')

/**
 * @callback requestCallback (error, data) as parameters
 */

/**
 * Generates a token for an authenticated user.
 * @param {String} id - The ObjectID of the user being authenticated 
 * @param {Boolean} isAdmin - whether to grant the user admin rights (true) or not
 * @param {function} requestCallback - Handles the function response.
 */
const generateToken = function (email, isAdmin, callback) {
    const issuedAt = new Date().getTime()
    // Expiry is 24h from issuedAt
    const expiry = new Date(issuedAt + 86400000).getTime()
    const payload = {
        "email" : email,
        "exp": expiry,
        "admin": isAdmin
    }
    jwt.sign(payload, process.env.secretKey, {
        algorithm : "HS512"
    }, (error, token) => {
        if (error) {
            callback({
                error:error,
                message:"Error generating token"
            })
        }else { 
            callback(null, token)
        }
    })
}

/**
 * Unpacks the provided JWT, or callbacks an error if it's not valid
 * @param {*} token - The token to be verified
 * @param {*} callback - Handles the function response
 */
const verifyJWT = function(token, callback) {
    return jwt.verify(token, process.env.secretKey, {}, (error, decoded) => {
        if (error) callback({error:"Error decoding JWT"})
        else {
            callback(null, decoded)
        }
    })
}

module.exports = {
    generateToken,
    verifyJWT
}