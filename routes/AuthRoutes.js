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
const ParameterValidation = require('../middlewares').ParameterValidation

module.exports = function (app) {
    // Assign permissions to appropriate routes
    app.use('/api/deleteUser', new RoleWare('deleteUser'))

    // Assign Parameter requirements for each role
    app.use('/api/deleteUser', new ParameterValidation('email'))
    app.use('/login', new ParameterValidation('email', 'password'))
    app.use('/register', new ParameterValidation('email', 'username', 'password'))
    app.use('/changePassword', new ParameterValidation('email', 'password', 'newpass'))

    /**
     * POST request on /login
     * Params:
     *      email, password
     */
    app.post('/login', (req,res) => {
        console.log('POST request on /login')
        const email = req.body.email
        const password = req.body.password

        AuthController.authenticateUser(req.ip, email, password, (error, result) => {
            if (error) {
                res.send({success:false, message:error})
            } else {
                var now = new Date().getTime()
                var expiry = new Date(now + 3600000)
                res.cookie('token', result, {
                    expires: expiry,
                    httpOnly: true
                })
                res.send({
                    success:true,
                    message:result
                })
            }
        })
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

        AuthController.registerUser(email, username, password, (error, result) => {
            if (error) res.send(error)
            else {
                res.send(result)
            }
        })
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
        const newPass = req.body.newpass

        AuthController.authenticateUser(req.ip, email, oldPass, (error, result) => {
            if (error) res.send(error)
            else {
                AuthController.changePassword(email, newPass, (error, result) => {
                    if (error) res.send(error)
                    else res.send(result)
                })
            }
        }) 

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
        console.log('POST request on /deleteUser')
        const email = req.body.email
        
        AuthController.deleteUser(email, (error, result) => {
            if (error) res.send(error)
            else res.send(result)
        })
    })

    /**
     * 
     */
    app.get('/api/verify/:code', (req,res) => {
        const code = req.params.code
        console.log('GET request on /api/verify/' + code)
        
    })

}