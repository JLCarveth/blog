/**
 * @module RoleWare - Express.js middleware to check a users role against the 
 * action they wish to complete.
 * @author John L. Carveth <jlcarveth@gmail.com>
 */

const RoleController = require('../controller').RoleController
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
        success: false,
        message: 'Authentication failed.'
    }) 
    else {

    }
}

/**
 * @function RoleWare - generates a middleware function to check a request for the 
 * given permission.
 * @param {String} perm - the name of the permission required by a route.
 */
const RoleWare = function (perm) {
    return function (req, res, next) {
        RoleController.checkPermission(perm, process.env.tokenRole, (error, result) => {
            if (error) res.status(401).send({
                success: false,
                message: 'Authentication has failed.'
            })
            else {
                if (result) {
                    // The role has correct perm, continue with middleware
                    next()
                } else {
                    res.status(403).send({
                        success:false,
                        message: 'User does not have necessary privileges.'
                    })
                }
            }
        })
    }
}

module.exports = RoleWare