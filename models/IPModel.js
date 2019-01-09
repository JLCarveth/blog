/**
 * @const mongoose - handles the data storage
 */
const mongoose = require('mongoose')

/**
 * @const Schema - the Schema object to be extended
 */
const Schema = mongoose.Schema

/**
 * @const IPSchema - defines how IP addresses are stored by the system.
 */
const IPSchema = new Schema({
    // The IP address, either IPV4 or IPV6
    address: { type: String, required: true },
    // When the IP was blocked
    banDate: { type: Date, default: Date.now()},
    // Reason for the ban (optional)
    reason: { type: String}
})

module.exports = IPSchema