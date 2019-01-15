/**
 * @module IPController
 * The `IPController` handles the logic for IP addresses.
 * @author John l. Carveth
 * @callback requestCallback (error, result) is used for all asynchronous calls.
*/

/**
 * @const IPModel the mongoose.Model object
*/
const IPModel = require('../models/').IPModel

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
    if (!isIP(address)) { callback({success: false, message: 'IP address not valid.'})}
    else IPModel.create({address:address, reason:reason}, (error, result) => {
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
    if (!isIP(address)) { callback({success: false, message: 'IP address not valid.'})}
    else IPModel.remove({address:address}, (error, result) => {
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
    if (!isIP(address)) { callback({success: false, message: 'IP address not valid.'})}
    else IPModel.findOne({address:address}, (error, result) => {
        if (error) callback(error)
        else if (result == null) callback(null, false)
        else callback(null, true)
    })
}

/**
 * @private
 * @function 
 * Verifies the validity of an IP address.
 * @param {String} ip - the IP address to verify
 * @return true if the IP address is valid
 */
const isIP = function (ip) {
    const regex = /((^\s*((([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]))\s*$)|(^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$))/
    return regex.test(ip)
}
