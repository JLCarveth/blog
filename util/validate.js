module.exports.isEmail = function (email) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
}

/**
 * A middleware function to use with ExpressJS for validating 
 * the tokens of incoming requests. 
 * Responds with a 403 if authentication is missing / invalid
 */
module.exports.validateToken = function (req,res,next) {
    const token = req.headers['x-access-token']
    console.log(`validateToken() - TOKEN: ${token}`)
    if (token) {
        //Make sure the token is valid[...]
        next()
    }else {
        return res.status(401).send({
            message: 'Missing token',
            success: false
        })
    } 
}