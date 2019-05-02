/**
 * @module RoleController
 * @author John L. Carveth
 * This module represents the logic layer for permission/role management
 * 
 * @callback requestCallback - (error, result) handles the function responses
 */

const RoleModel = require('../models').Role

/**
 * Dependencies
 */
const AuthController = require('./AuthController')

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
        console.log('Role ' + role + permission)
        RoleModel.findOne({'role':role}, (error,result) => {
            if (error) callback(error)
            else if (result == null) {
                console.error('Roles have not been seeded!')
            }
            else callback(null, result.permissions.includes(permission))
        })
    }
}

/**
 * @function createRole
 * Creates a new role with its own set of permissions.
 * **NOTE**: if deleteRole exists, it must ensure no user has rank of role before
 * it's deleted.
 * @param {String} role - the name of the new role
 * @param {Array} permissions - the permissions the role will have access to
 */
module.exports.createRole = function (role, permissions, callback) {
    if (!role || !permissions) callback({error:'Missing parameters.'})
    else {
        const Role = {
            'role':role,
            'permissions':permissions
        }
        RoleModel.create(Role, (error, result) => {
            if (error) callback(error)
            else callback(null, result)
        })
    }
}

/**
 * @function assignPermission
 * Assigns a new permission to an existing role
 * @param {String} role - the role to which a permission will be granted
 * @param {*} permission - the permission(s) to grant to role. Can be array or string
 */
module.exports.assignPermission = function (role, permission, callback) {
    if (!role || !permission) callback({error:'Missing parameters'})
    else {
        if (typeof permission == 'string') {
            RoleModel.findOneAndUpdate({'role':role}, {$push: {permissions:permission}}, 
            (error, result) => {
                if (error) callback(error)
                else callback(result)
            })
        } else if (Array.isArray(permission)) {
            RoleModel.findOneAndUpdate({'role':role}, {$push: {permissions: {$each:permission}}}, 
            (error, result) => {
                if (error) callback(error)
                else callback(result)
            })
        }
    }
}

/**
 * @function revokePermission
 * Revokes a set of permissions from an existing role
 */
module.exports.revokePermission = function (role, permission, callback) {
    if (!role || !permission) callback({error:'Missing parameters'})
    else {
        if (typeof permission == 'string') {
            RoleModel.findOneAndUpdate({'role':role}, {$push: {permissions:permission}}, 
            (error, result) => {
                if (error) callback(error)
                else callback(result)
            })
        } else if (Array.isArray(permission)) {
            RoleModel.findOneAndUpdate({'role':role}, {$pull: {permissions: {$each:permission}}}, 
            (error, result) => {
                if (error) callback(error)
                else callback(result)
            })
        }
    }
}

/**
 * @function removeRole
 * Removes the given role from the DB, given no user is assigned role
 * @param {String} role the name of the role to remove
 * @param {requestCallback} callback - handles the function response.
 */
module.exports.removeRole = function (role, callback) {
    AuthController.getUsersByRole(role, (error, result) => {
        if (error) callback(error)
        else if (result.length > 1) {
            callback('Cannot remove role while there are users assigned to it.')
        } else {
            // Assuming no user has the role to be deleted
            RoleModel.findOneAndDelete({'role':role}, (error, result) => {
                if (error) callback(error)
                else if (result == null){
                    callback(null, false)
                } else callback(null, true)// The role was deleted
            })
        }
    })
}

/**
 * @function generateCache
 * Fetches and stores a cache of the roles stored in the DB
 * @param {requestCallback} callback - handles the function response
 */
module.exports.generateCache = function (callback) {
    RoleModel.find({}, (error, result) => {
        if (error) callback(error)
        else callback(null,result)
    })
}


