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
 * @param {String} permission - the permission required by role
 * @param {String} role - the role which should contain permission
 * @param {requestCallback} callback - handles the function response
 */
module.exports.checkPermission = function (permission, role, callback) {
    if (!permission || !role) callback({error: 'One or more parameters not provided.'})
    else {
        RoleModel.findOne({role:role}, (error,result) => {
            if (error) callback(error)
            else callback(result.permissions.includes(permission))
        })
    }
}
