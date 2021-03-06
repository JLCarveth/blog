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
const IPFilterWare = function () {
    this.cache = []
    this.refreshCache()
    var that = this // Scope needed for the middleware decl

    return function (req, res, next) {
        var ip = req.ip
        // Ensure to trim any silly bits
        if (ip.substr(0,7) == '::ffff:') {
            ip = ip.substr(7)
        }
        that.checkAddress(ip, (error, result) => {
            if (result == false) next()
            else {
                // The IP was found on the blacklist...
                res.status(403).send({
                    success: false,
                    message: "Unauthorized."
                })
            }
        })
    }
}

IPFilterWare.prototype.refreshCache = function () {
    this.cache = []
    IPController.generateCache((error, cache) => {
        if (error) console.error(error)
        else this.cache = cache
    })
}

/**
 * @function checkAddress
 * Checks an incomming IP address against the cached IP addresses. 
 * A `true` result means the IP was found in the list of banned addresses.
 * @param {String} address - the IP address
 * @param {requestCallback} callback - handles the function response
 */
IPFilterWare.prototype.checkAddress = function (address, callback) {
    var contains = false
    this.cache.forEach((i) => {
        if (i.address == address) contains = true 
    })

    callback(null, contains)
}

module.exports = IPFilterWare
