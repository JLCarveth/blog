/**
 * @module RoleController
 * @author John L. Carveth
 * This module represents the logic layer for permission management
 * 
 * @callback requestCallback - (error, result) handles the function responses
 */

const RoleModel = require('../models').Role

/**
 * @function getPermissions
 * @param {String} roleName - the name of the role
 * @param {requestCallback} callback - handles the response.
 */
module.exports.getPermissions = function (roleName, callback) {
    if (!rolename) callback({error: 'Parameter `roleName` is missing.'})
    else {
        RoleModel.findOne({role:roleName}, (error, result) => {
            if (error) callback(error)
            else callback(null, result.permissions)
        })
    }
}

/**
 * @function checkPermission
 * Checks if the provided role has been given the provided permission
 * @param {*} permission - the permission required by role, can either be single string, or array of perms.
 * @param {String} role - the role which should contain permission.
 * @param {requestCallback} callback - handles the function response
 */
module.exports.checkPermission = function (permission, role, callback) {
    if (!permission || !role) callback({error: 'One or more parameters not provided.'})
    else if (Array.isArray(permission)) {
        var check = true
        perms.forEach((i) => {
            checkPermission(i, role, (error, result) => {
                if (error) callback(error)
                check = result && check
            })
        })
    }
    else {
        RoleModel.findOne({'role':role}, (error,result) => {
            if (error) callback(error)
            else if (result == null) {
                console.error('Roles have not been seeded!')
            }
            else callback(null, result.permissions.includes(permission))
        })
    }
}


