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
 * RoleSchema Schema
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

const createRole = async ({role, permissions}) => {
    const matches = await RoleModel.find({role}).exec();

    if (matches.length === 0) {
        return RoleModel.create({role, permissions});
    }
};
// The User role
const userRole = {
    role: 'user',
    permissions: ['readPost', 'commentPost', 'votePost']
}

// The author role
const authorRole = {
    role: 'author',
    permissions: ['readPost', 'createPost', 'editPostSelf', 'commentPost',
'votePost']
}

// The admin role
const adminRole = {
    role: 'admin',
    permissions: ['readPost', 'createPost', 'editPost', 'commentPost',
    'votePost', 'approvePost', 'approveAccount']
}

(async () => {
    await createRole(userRole)
    console.log('User role has been seeded.')

    await createRole(authorRole)
    console.log('Author role has been seeded.')

    await createRole(adminRole)
    console.log('Admin role has been created.')
})

module.exports = RoleSchema