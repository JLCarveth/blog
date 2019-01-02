/**
 * @file Handles all of the routing for operations on blog post data
 * @author John L. Carveth
 */

const BlogController = require('../controller').BlogController
const AuthController = require('../controller').AuthController

module.exports = function (app) {

    /**
     * POST request to /api/submitpost
     * Stores the submitted post in the collection. The post will need to be 
     * approved before becoming eligible to be sent to clients (ie, visible to users)
     * 
     * Params:
     *  - title: {String} The title of the blog post. Not optional
     *  - subtitle {String} The optional subtitle of the post. 
     *  - content {String} The markdown-formatted content of the post.
     *  - tags {String} The tags to be attached to the post for searching. Strings separated by commas
     */
    app.post('/api/post', (req,res) => {
        const title = req.body.title
        const subtitle = req.body.subtitle
        const authorEmail = process.env.tokenEmail
        const content = req.body.content
        const tags = req.body.tags

        // Check for any missing non-optional fields
        if (!title || !content) {
            res.send({success:false, message: "Title/Author/Content missing from request"})
            return
        }

        var author = ''
        // Get the ObjectID associated with the email address from the token
        AuthController.getAuthorID(authorEmail, (error, result) => {
            if (error) {res.send({success:false, message:error})}
            else {
                author = result
                // Now that we have the author's ID, we create the blog post.
                BlogController.createBlogPost(title,subtitle,author,content,tags, 
                    (error, result) => {
                    if (error) {
                        res.send({success: false, message: error})
                        return
                    }
                    res.send({success:true, message:result})
                })
            }
        })
    })

    /**
     * POST request to /api/post/approve
     * User requesting this action must have admin privilleges. Approves a blog post,
     * making it visible to end users.
     * 
     * Params:
     *  - blogID: {String} The ID of the blog post to be approved
     * */
    app.post('/api/post/approve', (req,res) => {
        const blogID = req.body.blogID

        // If the user does not have administrator rights, or somehow 
        // The environment variable is null (meaning auth failed)
        if (!process.env.tokenIsAdmin) {
            return res.status(401).send({
                success: false,
                message: 'Action requires administrator rights.'
            }) 
        }

        BlogController.approvePost(blogID, (error, result) => {
            if (error) res.send({
                success: false,
                message: error
            }) 
            else res.send({success:true, message:result})
        })
    })

    /**
     * POST 
     */
}