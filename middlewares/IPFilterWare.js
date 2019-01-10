/**@module IPFilterWare - Express.js middleware to filter requests from blocked IPs. */
/**
 * Module Dependencies
 */
const IPController = require('../controller').IPController

/**
 * Middleware called on all routes to check the client's IP
 * @param {Object} req - the Express.js request object
 * @param {Object} res - the Express.js response object
 * @param {Function} next - the Express.js middleware-chaining function
 */
module.exports.filterIP = function (req,res,next) {
    const ip = req.ip

    // Ensure to trim any 
    if (ip.substr(0,7) == '::ffff:') {
        ip = ip.substr(7)
    }

    IPController.checkAddress(address, (error, result) => {
        if (error || result == false) next()
        else {
            // The IP was found on the blacklist...
            res.status(403).send({
                success: false,
                message: "Unauthorized."
            })
        }
    })
    
}