/**
 * @module routes/RoleRoutes
 * @requires express
 * Manages all API routes relating to role CRUD
 * Current Routes:
 * - /api/createRole [POST]
 * - /api/assignPermission [POST]
 * - /api/revokePermission [POST]
 * - /api/removeRole [POST]
 */

const RoleController   = require('../controller').RoleController
const RoleWare         = require('../middlewares').RoleWare
const ParameterValidation = require('../middlewares').ParameterValidation

module.exports = function (app) {
    // Require permissions for necessary routes
    app.use('/api/createRole', new RoleWare('modifyRole'))
    app.use('/api/assignPermission', new RoleWare('modifyRole'))
    app.use('/api/revokePermission', new RoleWare('modifyRole'))
    app.use('/api/removeRole', new ParameterValidation('modifyRole'))
    // Require parameters
    app.use('/api/createRole', new ParameterValidation('role','permissions'))
    app.use('/api/assignPermission', new ParameterValidation('role','permissions'))
    app.use('/api/revokePermission', new ParameterValidation('role', 'permissions'))
    app.use('/api/removeRole', new ParameterValidation('role'))

    /**
     * POST request on /api/createRole
     * Params:
     * - role {String} the name of the new role
     * - permissions {String} permissions the role will have, separated by commas
     */
    app.post('/api/createRole', (req,res) => {
        console.log('POST request on /api/createRole')
        const role = req.body.role
        var permissions = req.body.permissions
        permissions = permissions.split(',')

        if (permissions.length === 1) permissions = permissions.toString()

        const Role = {
            'role':role,
            'permissions': permissions
        }

        RoleController.createRole(role, permissions, (error) => {
            if (error) res.send({success:false, message: error})
            else res.send({success:true, message:'Role created.'})
        })
    })

    /**
     * POST request on /api/assignPermission
     * Params:
     * - role {String} - the name of the role to modify
     * - permission {String} - the permission(s) to grant. Each permission separated by commas
     */
    app.post('/api/assignPermission', (req,res) => {
        console.log('POST request on /api/assignPermission')
        const role = req.body.role
        const permissions = req.body.permissions
        permissions = permissions.split(',')

        if (permissions.length === 1) permissions = permissions.toString()

        RoleController.assignPermission(role, permissions, (error) => {
            if (error) res.send({success:false, message: error})
            else res.send({success:true, message:'Role updated.'})
        })
    })

     /**
     * POST request on /api/revokePermission
     * Params:
     * - role {String} - the name of the role to modify
     * - permission {String} - the permission(s) to grant
     */
    app.post('/api/assignPermission', (req,res) => {
        console.log('POST request on /api/assignPermission')
        const role = req.body.role
        const permissions = req.body.permissions
        permissions = permissions.split(',')

        if (permissions.length === 1) permissions = permissions.toString()

        RoleController.revokePermission(role, permissions, (error) => {
            if (error) res.send({success:false, message: error})
            else res.send({success:true, message:'Role updated.'})
        })
    })

    /**
     * POST request on /api/removeRole
     * Params:
     *  - role {String} - the name of the role to be removed.
     */
    app.post('/api/removeRole', (req,res) => {
        console.log('POST request on /api/removeRole')
        const role = req.body.role
        RoleController.removeRole(role, (error, result) => {
            if (error) res.status(500).send({
                success:false,
                message:error
            }) 
            else {
                const msg = result ? 'Role removed successfully.' : 'Role was not found.' 
                res.send({
                    success:true,
                    message:msg
                })
            }
        })
    })

}