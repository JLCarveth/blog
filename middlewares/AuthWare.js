/** @module AuthWare - Express.js middleware to verify access tokens */
/**
 * @const auth - the JWT utility wrapper
 */
const auth = require('./auth')
/**
 * @function
 * @param {Object} req - the Express.js request object
 * @param {Object} res - the Express.js response object
 * @param {Function} next - the Express.js next() function for middleware stack
 */
module.exports.validateToken = function (req,res,next) {
    const token = req.headers['x-access-token']
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
                process.env.tokenIsAdmin = decoded.admin
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