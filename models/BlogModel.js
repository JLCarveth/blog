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
    tagline: { type: String, required: false, trim: true },
    image: {type: String, required: false},
    // Author refers to the ObjectID of a document in the users collection (a registered user)
    author: { 
        type: String,
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
        author: { type: String, required: true },
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
// DECLARE STATICS HERE

module.exports = BlogSchema 