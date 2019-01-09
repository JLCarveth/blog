const auth = require('./auth')

/**
 * Simple regex string evaluation
 */
module.exports.isEmail = function (email) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
}

/**
 * A middleware function to use with ExpressJS for validating 
 * the tokens of incoming requests. 
 * Responds with a 401 Unauthorized if authentication is missing / invalid
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

/**
 * Check the IP making the request isn't blacklisted.
 */
module.exports.checkIP = function (req,res,next) {
    const ip = req.ip
    
}