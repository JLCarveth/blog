/**
 * @module models/RoleModel
 * @author John L. Carveth
 * A mongoose model defining roles within the system. Each role has a name, 
 * ex. 'user', 'author', and 'admin'.
 * Each role also has an array of permissions, in string format. 
 * ex. 'makePost' or 'deletePost'
 */
/**
 * Dependencies
 */
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const RoleSchema = new Schema({
    role: {
        type: String,
        default: "user",
        unique: true
    },
    permissions: {
        type: [String]
    }
})

const RoleModel = mongoose.model('roles',RoleSchema)

module.exports = RoleSchema