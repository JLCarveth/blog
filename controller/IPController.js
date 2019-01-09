/**
 * @file
 * The `IPController` handles the logic for IP addresses.
 * git.
 * 
 * @callback requestCallback (error, result) is used for all asynchronous calls.
*/

/**
 * @const IPModel the mongoose.Model object
*/
const IPModel = require('..models/').IPModel

/**
 * @function
 * Adds a new IP address to the block list.
 * @param {String} address - the IP address to block
 * @param {String} [reason] - the reason for banning this IP (optional)
*/
module.exports.banAddress = function (address, reason, callback) {
    if (address.substr(0,7) == '::ffff:') {
        address = address.substr(7)
    }
    IPModel.create({address:address, reason:reason}, (error, result) => {
        if (error) callback(error)
        else callback(null, result)
    })
}

/**
 * @function
 * Removes an IP address from the blacklist.
 * @param {String} address - the IP address to unban.
 * @param {requestCallback} callback - handles the function response.
 */
module.exports.unbanAddress = function (address, callback) {
    IPModel.remove({address:address}, (error, result) => {
        if (error) callback(error)
        else callback(null, result)
    })
}

/**
 * @function
 * Check an IP address against the blacklist. Result is true if the IP
 * is found on the blacklist. 
 * @param {String} address - the IP address to check
 * @param {requestCallback} callback - handles the function response
 */
module.exports.checkAddress = function (address, callback) {
    IPModel.findOne({address:address}, (error, result) => {
        if (error) callback(error)
        else if (result == null) callback(null, false)
        else callback(null, true)
    })
}
