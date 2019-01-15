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

/**
 * @class RoleSchema
 * The RoleSchema which defines how the data is structured.
 * Each role has a role name, and a list of permissions.
 * These roles will be fairly constant.
 */
const RoleSchema = new Schema({
    role: {
        type: String,
        default: "user",
    },
    permissions: {
        type: [String]
    }
})

const RoleModel = mongoose.model('roles',RoleSchema)
RoleModel.create({
    role: 'user',
    permissions: ['readPost', 'commentPost', 'votePost']
}, (error, result) => {})

RoleModel.create({
    role: 'author',
    permissions: ['readPost', 'createPost', 'editPostSelf', 'commentPost',
'votePost']
}, (error, result) => {
    if (error) console.log(`Error: ${error}`)
    else console.log('Result')
})

module.exports = RoleSchema