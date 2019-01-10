/**
 * @module routes/IPRoutes
 * @requires express
 * This route handles all operations relating to IP addresses on the blacklist.
*/

/**
 * @const IPController - handles the business logic for IP addresses
 */
const IPController = require('../controller').IPController


module.exports = function (app) {
    /**
     * POST request on /api/banip
     * Params:
     *      address
     */
    app.post('/api/banip', (req,res) => {
        console.log('POST request on /api/banip')
        const address = req.body.address

        if (!address) {res.status(422).send({success:false,message:'IP address was not provided.'})}

        IPController.banAddress(address, (error, result) => {
            // Somehow the IP address cannot be banned
            if (error) res.send({success:false, result:error})
            else res.send({success:true,message:result})
        })
    })
}

