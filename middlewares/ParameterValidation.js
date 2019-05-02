/**
 * @module ParameterValidation - Express.js middleware that ensures all parameters
 * required for a request are defined.
 * @version 0.1.0
 * @author John L. Carveth
 */

 /**
  * @constructor ParameterValidation
  * Creates a new Middleware instance to validate parameters
  * @param  {...any} params to read from req.query instead of req.body, the first param should be false.
  */
const ParameterValidation = function (...params) {
    this.args = Array.from(arguments)// convert to Array
    this.undf = [] // Contains missing arguments to notify user
    this.bodyParams = true // True: req.body False: req.query
    if (typeof this.args[0] === 'boolean') {
        this.bodyParams = this.args.shift()
    }

    var that = this
    return function (req,res,next) {
        var valid = true
        const paramFlag = that.bodyParams ? req.body : req.query
        for (let arg of that.args) {
            valid = (paramFlag[arg] != undefined)
            if (paramFlag[arg] == undefined) {
                that.undf.push(arg)
            }
        }
        if (!valid) {
            that.undf = [] // Clear data for subsequent requests to route
            res.status(422).send({
                success:false,
                message:'Missing the following parameters: ' + that.undf.toString()
            })
    } else {
            that.undf = [] // Clear data for subsequent requests to route
            next()
        }
    }
}

module.exports = ParameterValidation