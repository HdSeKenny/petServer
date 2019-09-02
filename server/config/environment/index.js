'use strict';

const path = require('path');
const _ = require('lodash');

const all = {
    env: process.env.NODE_ENV,

    //Root path of server
    root: path.normalize(`${__dirname}/../../..`),

    host: '127.0.0.1',
    //server port
    port: 9000,

    //server IP
    ip: process.env.IP || '0.0.0.0',

    // Should we populate the DB with sample data?
    seedDB: false,

    // Secret for session, you will want to change this and make it an environment variable
    secrets: {
        session: 'pet-server-secret'
    },

    // MongoDB connection options
    mongo: {
        options: {
        useMongoClient: true
        }
    }
}

// Export the config object based on the NODE_ENV
// ==============================================
module.exports = _.merge(all, require('./shared'), require(`./${process.env.NODE_ENV}.js`) || {})