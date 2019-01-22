/**
 * @module seed Handles seeding the MongoDB with initial data.
 * @author John L. Carveth
 */

/**
 * Dependencies
 */
var mongoose = require('mongoose')

const Seeder = function () {
    this.connected = false;
}

/**
 * @function connect
 * Connects to the MongoDB server
 * @param db the database connection URI
 * @param cb the function that can be called after connection
 */
Seeder.prototype.connect = function (...params) {
    var that = this;
    var db,cb
    if (arguments.length == 1) {
        db = arguments[0]
    } else if (arguments.length == 2) {
        db = arguments[0]
        cb = arguments[1]
    } else {
        console.error('Seeder.connect() only takes 1-2 arguments.')
    }

    // If mongoose already has a connection
    if (mongoose.connection.readystate == 1) {
        that.connected = true
        cb();
    } else {
        mongoose.connect(db, (error, result) => {
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

    for (i in data) {
        m = data[i]
        const Model = mongoose.model(m.model)
        for (j in m.documents) {
            var obj = m.documents[j]
            
            Model.findOne({'role':obj.role}, (error, result) => {
                if (error) console.error('An error occurred.')
                else if (!result) {
                    Model.create(obj, (error) => {
                        if (error) console.error('Error seeding. ' + error)
                        console.log('Data has been seeded: ' + obj)
                    })
                }
            })
        }
    }
}

Seeder.prototype.disconnect = function () {
    mongoose.disconnect()
}

module.exports = new Seeder()