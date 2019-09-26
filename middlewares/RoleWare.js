/**
 * @module RoleWare - Express.js middleware to check a users role against the 
 * action they wish to complete.
 * @author John L. Carveth <jlcarveth@gmail.com>
 * @version 0.2.0
 */

 /**
  * Dependencies
  */
const RoleController = require('../controller').RoleController

/**
 * @function RoleWare - generates a middleware function to check a request for the 
 * given permission.
 * @param {String} perm - the name of the permission required by a route.
 */
const RoleWare = function (perm) {
    this.cache = []
    this.refreshCache()
    var that = this
    return function (req, res, next) {
        that.checkPermission(perm, req.tokenRole, (error, result) => {
            if (error) res.status(401).send({
                success:false,
                message: 'Authentication error.'
            }) 
            else if (result) {
                // The role has the correct permission, continue with middleware
                next()
            } else {
                res.status(403).send({
                    success: false,
                    message: 'User does not have necessary privileges.'
                })
            }
        })
    }
}

RoleWare.prototype.refreshCache = function () {
    this.cache = []
    RoleController.generateCache((error, result) => {
        if (error) console.error(error)
        else this.cache = result
    })
}

/**
 * @function checkPermission
 * Checks if role has been granted permission.
 * @param {String} permission - A single permission as string.
 * @param {String} role - The role trying to access permission
 * @param {requestCallback} callback - handles the function response.
 */
RoleWare.prototype.checkPermission = function(permission, role, callback) {
    var contains = false
    this.cache.forEach((i) => {
        if (i.role == role) {
            i.permissions.forEach((perm) => {
                if (permission == perm) contains = true
            })
        }
    })

    callback(null,contains)
}

module.exports = RoleWare