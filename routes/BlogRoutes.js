/**
 * @module routes/BlogRoutes
 * @author John L. Carveth
 * @requires express
 * Handles all of the routing for operations on blog post data
 */

const BlogController    = require('../controller').BlogController
const AuthController    = require('../controller').AuthController
const RoleWare          = require('../middlewares').RoleWare

module.exports = function (app) {

    // Assign perm requirements to each applicable route
    app.use('/api/post', new RoleWare('createPost'))
    app.use('/api/post/approve', new RoleWare('approvePost'))

    /**
     * POST request to /api/post
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
        // This route requires the user has the 'createPost' perm
        const title = req.body.title
        const subtitle = req.body.subtitle
        // tokenEmail is set by AuthWare
        const authorEmail = req.tokenEmail
        const content = req.body.content
        const tags = req.body.tags

        // Check for any missing non-optional fields
        if (!title || !content) {
            res.status(422).send({success:false, message: "Title/Author/Content missing from request"})
            return
        }

        var author = ''
        // Get the ObjectID associated with the email address from the token
        AuthController.getUserEmail(authorEmail, (error, result) => {
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
        
        BlogController.approvePost(blogID, (error, result) => {
            if (error) res.send({
                success: false,
                message: error
            }) 
            else res.send({success:true, message:result})
        })
    })

    /**
     * GET request to /blog/
     * Fetch the 5 most recent approved blog posts.
     */
    app.get('/blog/', (req,res) => {
        BlogController.fetchRecent((error, result) => {
            if (error) res.send({success: false, message: error
            }) 
            else {
                res.send({success:true, message:result})
            }
        })
    })

    /**
     * GET request to /blog/a/authorID
     * Gets all of the blog posts authored by the given user.
     */
    app.get('/blog/a/:author', (req,res) => {
        const authorID = req.params.author

        if (!authorID) {
            res.send({success: false, message: 'Author ID must be provided.'})
        } else {
            BlogController.getPostsByAuthor(author, (error, result) => {
                if (error) res.send({success:true, message:result})
            })
        }
    })


    /**
     * GET request to /blog/b/:id
     * Gets a specific blog post by its ID.
     * 
     * Params:
     *      - author
     */
    app.get('/blog/b/:id', (req,res) => {
        const id = req.params.id

        if (!id) {
            res.send({success:false, message: 'Post ID must be provided.'})
        } else {
            BlogController.getPost(id, (error, result) => {
                if (error) res.send({success:false, message:error})
                else res.send({success:true, message:result})
            })
        }
    })

    /**
     * POST request to /blog/comment
     * Posts a comment to the blog post with matching ID.
     * 
     * Params:
     *      - author, blogpost, content
     */
    app.post('/api/blog/comment', (req,res) => {
        const authorID = req.body.author
        const blogID = req.body.blogpost
        const content = req.body.content

        if (!authorID || !blogID || !content) {
            res.status(400).send({success:false,message:'Missing parameters'})
        } else {
            BlogController.postComment(authorID,blogID,content, (error, result) => {
                if (error) res.send({success:false,message:error})
                else res.send({success:true, message:'Comment has been posted.'})
            })
        }
    })
}