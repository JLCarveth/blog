/**
 * @file Handles all of the CRUD operations for blog posts and comments
 * @author John L. Carveth
 */

module.exports = function (app) {

    /**
     * POST request to /api/post
     * Stores the submitted post in the unapproved collection in the database.
     * Posts need to be approved before being stored in the main collection.
     * 
     * Params:
     *  
     */
    app.post('/api/post', (req,res) => {

    })
}