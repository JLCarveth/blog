/**
 * @file This controller handles all blog posting / editing / retreival / search / etc...
 */

 const BlogModel = require('../models').Blog

/**
 * @callback requestCallback (error, data)
*/

/**
 * @function
 * Creates a new, unapproved blog post
 * @param {String} title - the title of the new blog post
 * @param {String} subtitle - the optional subtitle
 * @param {ObjectID} author - the author submitting the blog post
 * @param {String} content - The content of the blog post, in Markdown format.
 * @param {String} tags - Tags attached to the post for searching, tags separated by commas.
 * @param {requestCallback} callback - Handles the function response
 * */
module.exports.createBlogPost = function (title,
    subtitle, author, content, tags, callback) {
    const tagArray = compileTags(tags)

    // The object that will be passed to mongoose
    const post = {
        title: title,
        subtitle: subtitle,
        author: author,
        content: content,
        tags: tagArray
    }

    // Create the blog post
    BlogModel.create(post, (error, result)  => {
        if (error) {
            callback(error)
            return
        }
        callback(null, result)
    })
}

/**
 * @function
 * Approves a blog post with the given ID
 * @param {ObjectID} blogID - the ID of the unapproved blog post
 */
module.exports.approvePost = function(blogID, callback) {
    BlogModel.updateOne({_id:blogID}, {approved:true}, (error, result) => {
        if (error) callback(error)
        else callback(null,result)
    })
}


/**
 * Utility function for creating the tag array
 * @param {String} tagString - String of tags separated by commas
 * @return an array of Strings
 */
const compileTags = function (tagString) {
    return tagString.split(',')
}