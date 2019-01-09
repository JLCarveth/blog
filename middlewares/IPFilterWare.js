/**
 * @const IPController - manages the IP logic
 */
const IPController = require('../controller').IPController

/**
 * @module IPFilterWare - Express.js middleware to filter requests from blocked IPs.
 * @param {Object} req - the Express.js request object
 * @param {Object} res - the Express.js response object
 * @param {Function} next - the Express.js middleware-chaining function
 */
module.exports.filterIP = function (req,res,next) {
    const ip = req.ip

    if (ip.substr(0,7) == '::ffff:') {
        ip = ip.substr(7)
    }
    
}