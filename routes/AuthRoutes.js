/** 
 * The AuthController handles the authentication logic
 * Current URL Routes:
 * - /login [POST]
 * - /register [POST]
 * - /changePassword [POST]
 */
const AuthController = require('../controller').AuthController

module.exports = function (app) {
    /**
     * POST request on /login
     * Params:
     *      email, password
     */
    app.post('/login', (req,res) => {
        console.log('POST Request on /login')
        const email = req.body.email
        const password = req.body.password

        if (!email || ! password) {
            res.end('Email or Password not provided')
        } else {
            AuthController.authenticateUser(email, password, (error, result) => {
                if (error) res.json(error)
                else {
                    console.log(`Result: ${result}`)
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
        console.log('POST Request on /register')
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
        console.log('POST Request on /changePassword')
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

}