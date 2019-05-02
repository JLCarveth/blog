const AuthRoutes = require('./AuthRoutes')
const BlogRoutes = require('./BlogRoutes')
const IPRoutes = require('./IPRoutes')
const RoleRoutes = require('./RoleRoutes')
module.exports = function(app) {
    AuthRoutes(app)
    BlogRoutes(app)
    IPRoutes(app)
    RoleRoutes(app)
}