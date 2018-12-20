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
 * 
*/
module.exports.createBlogPost = function (title,
    subtitle, author, content, tags, callback) {
    const tags = compileTags(tags)
    const id = ''

    const post = {
        title: title,
        subtitle: subtitle,
        author: author,
        content: content,
        tags: tags
    }

    // Create the blog post
    BlogModel.create(post, (error, result)  => {
        if (error) {
            callback(error)
            return
        }
        id = result.id
        callback(null, result)
    })

    console.log('ID: ' + id)
}


/**
 * Utility function for creating the tag array
 * @param {String} tagString - String of tags separated by commas
 * @return an array of Strings
 */
const compileTags = function (tagString) {
    return tagString.split(',')
}