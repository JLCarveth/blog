/**
 * @file Handles all of the CRUD operations for blog posts and comments
 * @author John L. Carveth
 */

const BlogController = require('../controller').BlogController

module.exports = function (app) {

    /**
     * POST request to /api/post
     * Stores the submitted post in the unapproved collection in the database.
     * Posts need to be approved before being stored in the main collection.
     * 
     * Params:
     *  - title: {String} The title of the blog post. Not optional
     *  - subtitle {String} The optional subtitle of the post.
     *  - author {String} The ObjectID of the author user submitting the post. 
     *  - content {String} The markdown-formatted content of the post.
     *  - tags {String} The tags to be attached to the post for searching. Strings separated by commas
     */
    app.post('/api/post', (req,res) => {
        const title = req.body.title
        const subtitle = req.body.subtitle
        const author = req.body.author

        const content = req.body.content
        const tags = req.body.tags

        // Check for any missing non-optional fields
        if (!title || !author || !content) {
            res.send({success:false, message: "Title/Author/Content missing from request"})
            return
        }

        BlogController.createBlogPost(title,subtitle,author,content,tags, 
            (error, result) => {
            if (error) {
                res.send({success: false, message: error})
                return
            }
            res.send(result)
        })
    })
}