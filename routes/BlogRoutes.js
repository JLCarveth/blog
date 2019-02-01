/**
 * @module routes/BlogRoutes
 * @author John L. Carveth
 * @requires express
 * Handles all of the routing for operations on blog post data
 * 
 */

const BlogController        = require('../controller').BlogController
const AuthController        = require('../controller').AuthController
const RoleWare              = require('../middlewares').RoleWare
const ParameterValidation   = require('../middlewares').ParameterValidation

module.exports = function (app) {

    // Assign perm requirements to each applicable route
    app.use('/api/post', new RoleWare('createPost'))
    app.use('/api/post/approve', new RoleWare('approvePost'))

    // Assign required parameters to each route
    app.use('/api/post', new ParameterValidation('title','content'))
    app.use('/api/post/approve', new ParameterValidation('blogID'))
    app.use('/api/blog/comment', new ParameterValidation('author', 'blogpost', 'content'))

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

        var author = ''
        // Get the ObjectID associated with the email address from the token
        AuthController.getUserByEmail(authorEmail, (error, result) => {
            if (error) res.send({success:false, message:error})
            else {
                author = result._id
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
     * GET request to /blog/a/
     * Gets all of the blog posts authored by the given user.
     * Params:
     *  - author {String} the author username whose posts will be fetched.
     */
    app.get('/blog/a/:author', (req,res) => {
        const author = req.params.author

        if (!author) {
            res.send({success: false, message: 'Author ID must be provided.'})
        } else {
            BlogController.getPostsByUsername(author, (error, result) => {
                if (error) res.send({success:false, message:error})
                else res.send({success:true, message:result})
            })
        }
    })

    /**
     * GET request to /blog/b/:id
     * Gets a specific blog post by its ID.
     * 
     * Params:
     *   - author
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
     *   - author, blogpost, content
     */
    app.post('/api/blog/comment', (req,res) => {
        const authorID = req.body.author
        const blogID = req.body.blogpost
        const content = req.body.content

        BlogController.postComment(authorID,blogID,content, (error, result) => {
            if (error) res.send({success:false,message:error})
            else res.send({success:true, message:'Comment has been posted.'})
        })

    })

    /**
     * GET request to /blog/:tag
     * Get all blog posts with a certain tag
     * 
     * Params:
     *  - tag
     */
    app.get('/blog/t/:tag', (req,res) => {
        const tag = req.params.tag

        BlogController.getPostsByTag(tag, (error, result) => {
            if (error) res.status(500).send({success:false, message:error})
            else res.send({success:true, message:result})
        })
    })
}