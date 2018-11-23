// Make sure this file is in .gitignore when GIT is used
const secretKey = 'JqyCvhEqExjx4ESiW3bz6dubsJ3f9xPFz4b1x/QFWHAalcncpgNWO8S+OZhERK8ytZ3/dKTIoTGoclXhfx8VaQ=='
// Add the key to the user environment
process.env.secretKey = secretKey

const mongodbURI = 'mongodb://admin:Password1@ds231720.mlab.com:31720/nodejs'
process.env.mongodbURI = mongodbURI