'use strict'

const express = require('express')
const favicon = require('serve-favicon')
const morgan = require('morgan')
const compression = require('compression')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const cookieParser = require('cookie-parser')
const errorHandler = require('errorhandler')
const path = require('path')
const lusca = require('lusca')
const config = require('./environment')
const passport = require('passport')
const session = require('express-session')
const connectMongo = require('connect-mongo')
const mongoose = require('mongoose')

const MongoStore = connectMongo(session)

const expressConfig = function(app) {
  const env = app.get('env')

  if (env === 'production') {
    app.use(favicon(path.join(config.root, 'client', 'favicon.ico')))
  }

  app.use(morgan('dev'))
  app.set('appPath', path.join(config.root, 'client'))
  app.use(express.static(app.get('appPath')))

  app.set('views', path.join(config.root, 'server', 'views'))
  app.set('view engine', 'html')
  app.engine('html', require('ejs').renderFile)

  app.use(compression())
  app.use(bodyParser.urlencoded({ extended: false }))
  app.use(bodyParser.json())
  app.use(methodOverride())
  app.use(cookieParser())
  app.use(passport.initialize())

  // Persist sessions with MongoStore / sequelizeStore
  // We need to enable sessions for passport-twitter because it's an
  // oauth 1.0 strategy, and Lusca depends on sessions
  app.use(
    session({
      secret: config.secrets.session,
      saveUninitialized: true,
      name: 'tms',
      resave: false,
      store: new MongoStore({
        mongooseConnection: mongoose.connection,
        db: 'server'
      })
    })
  )

  /**
   * Lusca - express server security
   * https://github.com/krakenjs/lusca
   */
  if (env !== 'test' && env !== 'development' && !process.env.SAUCE_USERNAME) {
    // eslint-disable-line no-process-env
    app.use(
      lusca({
        csrf: true,
        xframe: 'SAMEORIGIN',
        hsts: {
          maxAge: 31536000, //1 year, in seconds
          includeSubDomains: true,
          preload: true
        },
        xssProtection: true
      })
    )
  }

  if (env === 'development' || env === 'test') {
    app.use(errorHandler()) // Error handler - has to be last
  }
}

module.exports = expressConfig