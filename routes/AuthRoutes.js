/** 
 * @module routes/AuthRoutes
 * @requires express
 * The AuthController handles the authentication logic
 * Current URL Routes:
 * - /login [POST]
 * - /register [POST]
 * - /changePassword [POST]
 * - /deleteUser [POST]
 */
const AuthController    = require('../controller').AuthController
const RoleWare          = require('../middlewares').RoleWare

module.exports = function (app) {
    // Assign permissions to appropriate routes
    app.use('/api/deleteUser', new RoleWare('deleteUser'))

    /**
     * POST request on /login
     * Params:
     *      email, password
     */
    app.post('/login', (req,res) => {
        console.log('POST request on /login')
        const email = req.body.email
        const password = req.body.password

        if (!email || ! password) {
            res.status(422).send('Email or Password not provided')
        } else {
            AuthController.authenticateUser(email, password, (error, result) => {
                if (error) res.json(error)
                else {
                    console.log(`Result: ${result}`)
                    const expiry = new Date().getTime()
                    res.cookie('token', result, {
                        secure: true,
                         httpOnly:true,
                        expiry: new Date(expiry + 360000).getTime()})
                    res.json(result)
                }
             })
        }
    })

    /**
     * POST request on /register
     * Params:
     *      email, username, password
     */
    app.post('/register', (req,res) => {
        console.log('POST request on /register')
        const email = req.body.email
        const username = req.body.username
        const password = req.body.password

        if (!email || !username || !password) {
            res.end('Email, username, and/or password not provided.')
        } else {
            AuthController.registerUser(email, username, password, (error, result) => {
                if (error) res.send(error)
                else {
                    res.send(result)
                }
            })
        }
    })

    /**
     * POST request to /changePassword
     * Params:
     *      email, password, newPass
     * 
     * Essentially authenticates the user, then changes their password
     */
    app.post('/changePassword', (req,res) => {
        console.log('POST request on /changePassword')
        const email = req.body.email
        const oldPass = req.body.password
        const newPass = req.body.newPass

        if (!email || !oldPass || !newPass) {
            res.send('Email, password, or new password not provided.')
        } else {
            AuthController.authenticateUser(email, oldPass, (error, result) => {
                if (error) res.send(error)
                else {
                    AuthController.changePassword(email, newPass, (error, result) => {
                        if (error) res.send(error)
                        else res.send(result)
                    })
                }
            }) 
        }
    })

    /**
     * An authentication-only command to remove a user from the collection.
     * Can only be executed by a client with admin rights, or the owner of the account.
     * Params:
     *      email - The email of the user to delete
     * Header:
     *      x-access-token - The token acquired from authentication
     */
    app.post('/api/deleteUser', (req,res) => {
        const email = req.body.email
        console.log('Body Email ' + email)
        
        // If the email to delete is the email of the authenticated user,
        // Or if the user authenticated is an admin, delete user
        console.log(`Token: ${process.env.tokenEmail}, Admin: ${process.env.tokenIsAdmin}`)
        if ((email == process.env.tokenEmail) ||
            (process.env.tokenIsAdmin == true)) {
                AuthController.deleteUser(email, (error, result) => {
                    if (error) res.send(error)
                    else res.send(result)
                })
        } else {
            res.send({
                success: false,
                message: 'Error deleting user'
            })
        }
    })

}