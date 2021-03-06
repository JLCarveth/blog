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
  * Dependencies
  */
const AuthController = require('./AuthController')

/**
 * @function createBlogPost
 * Creates a new, unapproved blog post
 * @param {String} title - the title of the new blog post
 * @param {String} subtitle - the optional subtitle
 * @param {String} author - the username of the author submitting the blog post
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
 * @function approvePost
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
 * @function getPost
 * Get a blog post by its ID
 *
 * @param {ObjectID} postID - the ID of the blog to fetch
 * @param {requestCallback} callback - handles the function response.
 */
module.exports.getPost = function (blogID, callback) {
    BlogModel.findOne({_id:blogID, approved:true}, (error, result) => {
        if (error) callback(error)
        else callback(null,result)
    })
}

/**
 * @function updatePost
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
 * @function fetchRecent
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
 * @function getPostsByAuthorID
 * Get all blog posts made by a certain author.
 * @param {ObjectID} authorID - The ID of the author
 * @param {requestCallback} callback - handles the function response.
 */
module.exports.getPostsByAuthorID = function (authorID, callback) {
    BlogModel.find({author:authorID, approved:true}, (error, result) => {
        if (error) callback(error)
        else callback(null, result)
    })
}

/**
 * @function getPostsByUsername
 * @param {String} username - the username of the author
 * @param {requestCallback} callback - handles the function response.
 */
module.exports.getPostsByUsername = function (username, callback) {
    BlogModel.find({'author':username, approved:true}, (error, result) => {
        if (error) callback(error)
        else callback(null, result)
    })
}

/**
 * @function getPost
 * Fetches a single blog post by ID from the collection.
 * @param {ObjectID} blogID - the ObjectID of the post to get.
 * @param {requestCallback} callback - handles the function response.
 */
module.exports.getPost = function (blogID, callback) {
    BlogModel.findById({_id:blogID}, (error, result) => {
        if (error) callback(error)
        else callback(null, result)
    })
}

/**
 * @function getPostsByTag
 * @param {String} tag
 * @param {requestCallback} callback
 */
module.exports.getPostsByTag = function (tag, callback) {
    BlogModel.find({tags:tag}, (error, result) => {
        if (error) callback(error)
        else callback(null,result)
    })
}

/**
 * @function postComment
 * Pushes a new comment to the array within the blog post.
 */
module.exports.postComment = function (author, blogID, content, callback) {
    const comment = {'author':author, 'content':content}
    BlogModel.findOneAndUpdate({'_id':blogID}, {$push: {comments:comment}},
     (error, result) => {
         if (error) callback(error)
         else callback(null,result)
     })
}

/**
 * @function removeAllComments
 * Looks for any comment with the given authorID posted to the blog post with id blogID
 * Removes any comments by the authorID on blogID
 * @param {mongoose.SchemaTypes.ObjectID} authorID - author of the comment to delete
 * @param {mongoose.SchemaTypes.ObjectID} blogID - the ID of the post where the comment was made
 */
module.exports.removeAllComments = function (author, blogID, callback) {
    BlogModel.findOneAndUpdate({'_id':blogID}, {$pull: {comments:author}},
    (error, callback) => {
        if (error) callback(error)
        else callback(null,result)
    })
}

/**
 * @function removeComment
 * Removes the comment with given commentID from the matching blog post, if it exists
 * @param {mongoose.SchemaTypes.ObjectID} commentID - the ObjectID of the comment to remove
 * @param {mongoose.SchemaTypes.ObjectID} blogID - the ObjectID of the blog post where the comment was made
 * @param {requestCallback} callback - handles the function response
 */
module.exports.removeComment = function (commentID, blogID, callback) {
    BlogModel.findOneAndUpdate({'_id':blogID}, {$pull: {comments:commentID}},
    (error, result) => {
        if (error) callback(error)
        else callback(null,result)
    })
}

/**
 * @function compileTags
 * 
 * Utility function for creating the tag array
 * @param {String} tagString - String of tags separated by commas
 * @return an array of Strings
 */
const compileTags = function (tagString) {
    return tagString.split(',')
}