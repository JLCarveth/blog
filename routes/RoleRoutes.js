/**
 * @module routes/RoleRoutes
 * @requires express
 * Manages all API routes relating to role CRUD
 * Current Routes:
 * - /api/createRole [POST]
 * - /api/assignPermission [POST]
 * - /api/revokePermission
 */

const RoleController   = require('../controller').RoleController
const RoleWare         = require('../middlewares').RoleWare

module.exports = function (app) {
    // Require permissions for necessary routes
    app.use('/api/createRole', new RoleWare('modifyRole'))
    app.use('/api/assignPermission', new RoleWare('modifyRole'))
    app.use('/api/revokePermission', new RoleWare('modifyRole'))

    /**
     * POST request on /api/createRole
     * Params:
     * - role {String} the name of the new role
     * - permissions {String} permissions the role will have, separated by commas
     */
    app.post('/api/createRole', (req,res) => {
        console.log('POST request on /api/createRole')
        const role = req.body.role
        const permissions = req.body.permissions
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
     * - permission {String} - the permission(s) to grant
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

}