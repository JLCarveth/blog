const AuthRoutes = require('./AuthRoutes')
const BlogRoutes = require('./BlogRoutes')
const IPRoutes = require('./IPRoutes')
module.exports = function(app) {
    AuthRoutes(app)
    BlogRoutes(app)
    IPRoutes(app)
}