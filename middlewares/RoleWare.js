/**
 * @module RoleWare - Express.js middleware to check a users role against the 
 * action they wish to complete.
 * @author John L. Carveth <jlcarveth@gmail.com>
 * @version 0.1.0
 * 
 * TODO:
 *  - Handle both single permissions as well as permission arrays
 */

const RoleController = require('../controller').RoleController

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