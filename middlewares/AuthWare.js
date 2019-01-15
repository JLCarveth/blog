/** 
 * @module AuthWare - Express.js middleware to verify access tokens 
 * @author John L. Carveth <jlcarveth@gmail.com>
 */
/**
 * @const auth - the JWT utility wrapper
 */
const auth = require('../util/auth')
/**
 * @function validateToken
 * @param {Object} req - the Express.js request object
 * @param {Object} res - the Express.js response object
 * @param {Function} next - the Express.js next() function for middleware stack
 */
module.exports = function (req,res,next) {
    const token = req.headers['x-access-token'] || req.cookies.token
    console.log(`validateToken() - TOKEN: ${token}`)
    if (token) {
        auth.verifyJWT(token, (error, decoded) => {
            if (error) {
                res.status(401).send({
                    message: 'Invalid Token',
                    success: false
                })
            } else {
                // Register the token to the process environment
                process.env.tokenEmail = decoded.email
                process.env.tokenRole = decoded.role
                next()
            }
        })
    } else {
        return res.status(401).send({
            message: 'Missing token',
            success: false
        })
    }
}