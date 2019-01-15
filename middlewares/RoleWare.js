/**
 * @module RoleWare - Express.js middleware to check a users role against the 
 * action they wish to complete.
 * @author John L. Carveth <jlcarveth@gmail.com>
 */

/**
 * @function checkRole
 * This middleware should be called after AuthWare, as it will populate the required
 * environment variables. This checks the users role for the appropriate perms
 * for the action.
 * @param {Object} req - the Express.js request object
 * @param {Object} rep - the Express.js response object
 * @param {function} next - the Express.js next() functiion for middleware stack
 */
const checkRole = function (req,res,next) {
    const role = process.env.tokenRole
    if (!role) res.status(401).send({
        success: true,
        message: 'Authentication failed.'
    }) 
    else {

    }
}
