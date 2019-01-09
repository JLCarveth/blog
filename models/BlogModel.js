/**
 * @const mongoose - handles the data storage
 */
const mongoose = require('mongoose')
/**
 * @const Schema - the Mongoose schema object
 */
const Schema = mongoose.Schema

/**
 * Blog Post Schema for Mongoose
 */
const BlogSchema = new Schema({
    title: { type: String, required: true, trim: true },
    subtitle: { type: String, required: false, trim: true },
    // Author refers to the ObjectID of a document in the users collection (a registered user)
    author: { 
        type: Schema.Types.ObjectId,
        required:true
    },
    // When the article was published
    date: {
        type: Date,
        default: Date.now
    },
    // The content of the article, Markdown format
    content: {
        type: String,
        required: true
    },
    // The comments on the specific blog post. Comments can only be made by registered users
    comments: [{
        author: { type: Schema.Types.ObjectId, required: true },
        date: { type: Date, default: Date.now },
        content: { type: String, required: true }
    }],
    
    // For article search / sort / categorization
    tags: [{ type: String }],

    // All posts by default, are unapproved, and must be verified manually to become retreivable.
    approved: { type: Boolean, default: false },

    // The rating array tracks users' ratings of the given article.
    rating: [{
        // Voter is the registered user's MongoDB/Mongoose ObjectID
        voter: {
            type: Schema.Types.ObjectId,
            required: true
        },
        // true/false   :   +/-
        vote: {
            type: Boolean,
            required: true
        }
    }],

    // The rating is the approximate score (pos/neg votes) of a blog post.
    // The lastUpdate keeps track of when the score is updated (based on counting actual votes)
    approxRating: {
        rating: { type: Number, default: 1 },
        lastUpdate: { type: Date }
    },

    // For statistical purposes
    views: { type: Number, default: 0 }
})

/**
 * Method that attaches a comment to the blog post. This is a nonstatic method.
 * @param {ObjectID} authorID - the ObjectID of the comment author
 * @param {String} content - the content of the comment.
 */
BlogSchema.methods.createComment = function (authorID, content) {
    this.comments.push({author: authorID, content: content})
}

/**
 * Allows clients to get article snippets
 */
BlogSchema.virtual('snippet').get(() => {
    return this.content.substring(0,250).concat('...')
})

// DECLARE STATICS HERE

module.exports = BlogSchema 