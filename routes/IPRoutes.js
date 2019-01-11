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
     *      address, [reason]
     */
    app.post('/api/banip', (req,res) => {
        console.log('POST request on /api/banip')
        const address = req.body.address
        const reason = req.body.reason
        
        if (!address) {res.status(422).send(
            {success:false,message:'IP address was not provided.'})}

        IPController.banAddress(address, reason, (error, result) => {
            // Somehow the IP address cannot be banned
            if (error) res.send({success:false, result:error})
            else res.send({success:true,message:result})
        })
    })

    /**
     * POST request on /api/unbanip
     * Params:
     *      address
     */
    app.post('/api/unbanip', (req,res) => {
        console.log('POST request on /api/unbanip')

        const address = req.body.address

        if (!address) {releaseEvents.status(422).send(
            {success:false, message:'IP address was not provided.'})}
        IPController.unbanAddress(address, (error, result) => {
            if (error) res.send({success:false,result:error})
            else res.send({success:true, result:result})
        })
    })
}

