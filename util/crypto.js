const crypto = require('crypto');

/**
 * Hash a password, and generate a salt to hash it with
 * @param {string} password - The password to hash
 * @return an object containing the `hash` and the `salt`
 */
module.exports.hashPassword = function (password) {
    var salt = exports.generateSalt();
    var hash = crypto.createHmac('sha256', salt)
                .update(password)
                .digest('hex');

    return {
        hash:hash,
        salt:salt
    };        
}

/**
 * Hash a password with a provided salt
 */
module.exports.hashPasswordWithSalt = function (password, salt) {
    var hash = crypto.createHmac('sha256', salt)
                .update(password)
                .digest('hex');
    return {
        hash:hash,
        salt:salt
    };
}

/**
 *  Does as the title implies..
 */
module.exports.generateSalt = function () {
    var salt = crypto.randomBytes(16).toString('hex')

    return salt;
}

/**
 * Validate a password against a hash and salt
 */
module.exports.validateInput = function(password, hash, salt) {
    console.log(`Crypto:validateInput(${password}, ${hash}, ${salt})`)
    return module.exports.hashPasswordWithSalt(password, salt).hash
     == hash;
}

/**
 * Generates a random key
 * @param {Number} - The number of characters in the key
 */
module.exports.generateKey = function (length) {
    return crypto.randomBytes(length).toString('base64')
}