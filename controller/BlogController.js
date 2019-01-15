/**
 * @module BlogController
 * This controller handles all blog posting / editing / retreival / search / etc...
 * @author John L. Carveth <jlcarveth@gmail.com>
 * @callback requestCallback (error, result) is used for all asynchronous calls.
 */

 /**
  * @const BlogModel the mongoose.Model object
  */
 const BlogModel = require('../models').Blog

/**
 * @function
 * Creates a new, unapproved blog post
 * @param {String} title - the title of the new blog post
 * @param {String} subtitle - the optional subtitle
 * @param {ObjectID} author - the author submitting the blog post
 * @param {String} content - The content of the blog post, in Markdown format.
 * @param {String} tags - Tags attached to the post for searching, tags separated by commas.
 * @param {requestCallback} callback - Handles the function response
 */
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
 * @param {requestCallback} callback - handles the function response.
 */
module.exports.approvePost = function (blogID, callback) {
    BlogModel.updateOne({_id:blogID}, {approved:true}, (error, result) => {
        if (error) callback(error)
        else callback(null,result)
    })
}

/**
 * @function
 * Get a blog post by its ID
 *
 * @param {ObjectID} postID - the ID of the blog to fetch
 * @param {requestCallback} callback - handles the function response.
 */
module.exports.getPost = function (blogID, callback) {
    BlogModel.findOne({_id:blogID}, (error, result) => {
        if (error) callback(error)
        else callback(null,result)
    })
}

/**
 * @function
 * Updates a blog post. Any element of the blog post object can be changed except the ID
 * One should call getPost(), update the returned post object, then pass the updated
 * object to this function to make the change.
 * @param {Object} blog - the updated blog object
 * @param {requestCallback} callback - handles the function response.
 */
module.exports.updatePost = function (blog, callback) {
    BlogModel.updateOne({_id:blog._id}, {
        title: blog.title,
        subtitle: blog.subtitle,
        author: blog.author,
        date: blog.date,
        content: blog.content,
        comments: blog.comments,
        tags: blog.tags,
        approved: blog.approved,
        rating: blog.rating,
        approxRating: blog.approxRating,
        views: blog.views
    }, (error, result) => {
        if (error) callback(error)
        else callback(null,result)
    })
}

/**
 * @function
 * Gets at most five of the most recent approved posts within the collection.
 * @param {requestCallback} callback - handles the function response.
 */
module.exports.fetchRecent = function (callback) {
    BlogModel.find({approved:true}, (error, result) => {
        if (error) callback(error)
        else callback(null, result)
    }).sort({date: -1})
}

/**
 * @function
 * Get all blog posts made by a certain author.
 * @param {ObjectID} authorID - The ID of the author
 * @param {requestCallback} callback - handles the function response.
 */
module.exports.getPostsByAuthor = function (authorID, callback) {
    BlogModel.find({author:authorID}, (error, result) => {
        if (error) callback(error)
        else callback(null, result)
    })
}

/**
 * @function
 * Fetches a single blog post by ID from the collection.
 * @param {ObjectID} postID - the ObjectID of the post to get.
 * @param {requestCallback} callback - handles the function response.
 */
module.exports.getPost = function (postID, callback) {
    BlogModel.findById({_id:postID}, (error, result) => {
        if (error) callback(error)
        else callback(null, result)
    })
}

/**
 * @function
 * 
 * Utility function for creating the tag array
 * @param {String} tagString - String of tags separated by commas
 * @return an array of Strings
 */
const compileTags = function (tagString) {
    return tagString.split(',')
}