const AuthRoutes = require('./AuthRoutes')
const BlogRoutes = require('./BlogRoutes')
module.exports = function(app) {
    AuthRoutes(app)
    BlogRoutes(app)
}