const auth = require('./auth')

/**
 * Simple regex string evaluation
 */
module.exports.isEmail = function (email) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
}