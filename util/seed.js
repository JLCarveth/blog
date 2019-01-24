/**
 * @module seed
 * @author John L. Carveth
 * A module that can persist data to the MongoDB server once, 'seeding' the data.
 * TODO: Enable optional logging, for debugging
 */

/**
 * Dependencies
 */
var mongoose = require('mongoose')

/**
 * @class Seeder
 */
const Seeder = function () {
    this.connected = false;
}

/**
 * @function connect
 * Connects to the MongoDB server
 * @param db the database connection URI
 * @param opts the mongoose connection options object
 * @param cb the function that can be called after connection
 */
Seeder.prototype.connect = function (...params) {
    var that = this;
    var db,cb
    var opts = {}
    if (arguments.length == 1) {
        db = arguments[0]
    } else if (arguments.length == 2) {
        db = arguments[0]
        cb = arguments[1]
    } else if (arguments.length == 3) {
        db = arguments[0]
        opts = arguments[1]
        cb = arguments[2]
    } else {
        console.error('Seeder.connect() only takes 1-3 arguments.')
    }

    // If mongoose already has a connection
    if (mongoose.connection.readystate == 1) {
        that.connected = true
        cb();
    } else {
        mongoose.connect(db, opts, (error, result) => {
            if (error) console.error('Could not make connection to MongoDB')
            else {
                that.connected = true
                cb();
            }
        })
    }
}

/**
 * @function seedData
 * Persists data once to the MongoDB database.
 * @param {Object} data - the data to persist to the MongoDB collection
 * @param {Function} callback - will be called after data has been seeded.
 */
Seeder.prototype.seedData = function (data, callback) {
    if (this.connected == false) {
        console.error('Not connected to MongoDB.')
    }

    // Stores all promises to be resolved
    var promises = []
    // Fetch the model via its name string from mongoose
    const Model = mongoose.model(data.model)
    // For each object in the 'documents' field of the main object
    data.documents.forEach((item) => {
        promises.push(promiseDeletion(Model, item))
        promises.push(promiseIntertion(Model, item))
    })

    Promise.all(promises).catch(()=>{})
    callback();
}

/**
 * @function Seeder.disconnect
 * Closes the connection to MongoDB
 */
Seeder.prototype.disconnect = function () {
    mongoose.disconnect()
    this.connected = false
    console.log('Seeder disconnecting.')
}

/**
 * Creates a promise to check the existence of item within model
 * @param {mongoose.Model} model 
 * @param {Object} item 
 */
const promiseDeletion = function (model, item) {
    console.log('Promise Deletion ' + item.role)
    return new Promise((resolve, reject) => {
        model.findOneAndDelete(item, (error) => {
            if (error) reject()
            else resolve()
        })
    })
}

/**
 * Creates a promise to insert the given data to the given mongoose.Model 
 * @param {mongoose.Model} model 
 * @param {Object} item 
 */
const promiseInsertion = function (model, item) {
    return new Promise((resolve, reject) => {
        model.create(item, (error) => {
            if (error) reject()
            else resolve()
        })
    })
}

module.exports = new Seeder()