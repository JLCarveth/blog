/**
 * @module crypto - A Node.js module to handle password hashing and salt generation.
 * @author John L. Carveth <jlcarveth@gmail.com>
 */
/**
 * @const nodeCrypto Node.js Cryptography library
 *
 */
const nodeCrypto = require('crypto');

/**
 * @function hashPassword
 * Hash a password, and generate a salt to hash it with
 * @param {string} password - The password to hash
 * @return {Object} an object containing the `hash` and the `salt`
 */
module.exports.hashPassword = function (password) {
    var salt = exports.generateSalt();
    var hash = nodeCrypto.createHmac('sha256', salt)
                .update(password)
                .digest('hex');

    return {
        hash:hash,
        salt:salt
    };        
}

/**
 * @function hashPasswordWithSalt
 * Hash a password with a provided salt
 * @param {String} password - the password to be hashed
 * @param {String}salt - the salt to be used when hashing.
 */
module.exports.hashPasswordWithSalt = function (password, salt) {
    var hash = nodeCrypto.createHmac('sha256', salt)
                .update(password)
                .digest('hex');
    return {
        hash:hash,
        salt:salt
    };
}

/**
 * @function generateSalt
 *  Generates a 32-character salt to be used with hashing.
 * @return {String} the salt that was created.
 */
module.exports.generateSalt = function () {
    var salt = nodeCrypto.randomBytes(16).toString('hex')
    return salt;
}

/**
 * @function validateInput
 * Validate a password against a hash and salt
 * @param {String} password - the password attempt
 * @param {String} hash - the hashed password to compare against the attempt
 * @param {String} salt - the salt that was used to create the hash
 */
module.exports.validateInput = function(password, hash, salt) {
    return module.exports.hashPasswordWithSalt(password, salt).hash
     == hash;
}

/**
 * @function generateKey
 * Generates a random key
 * @param {Number} n - The number of characters in the key
 * @return an alphanumeric key of length n
 */
module.exports.generateKey = function (n) {
    return nodeCrypto.randomBytes(n).toString('base64')
}