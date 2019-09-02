const express = require('express');
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const config = require('./config/environment');
const http = require('http');
const expressConfig = require('./config/express');
const registerRoutes = require('./routes');
const seedDatabaseIfNeeded = require('./config/seed');

//connect to mongoDB
mongoose.connect(config.mongo.uri, config.mongo.options)
mongoose.connection.on('error', function(err){
  console.log(`MongoDB connection error: ${err}`)
  process.exit(-1) // eslint-disable-line no-process-exit
})

//setup server
const app = express()
const server = http.createServer(app)
expressConfig(app)
registerRoutes(app)

//start server
function startServer(){
  server.listen(config.port, config.ip, function(){
    console.log('Express server listening on %d, in %s mode', config.port, app.get('env'))
  })
}

seedDatabaseIfNeeded()
  .then(startServer)
  .catch((err) => {
    console.log('Server failed to start due to error: %s', err)
  })

// Expose app
exports = module.exports = app