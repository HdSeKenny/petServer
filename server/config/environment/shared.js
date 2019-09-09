'use strict';

module.exports = {
    env: process.env.NODE_ENV,
    port: process.env.PORT || 3000,
    //list of user roles
    userRoles: ['guest', 'user', 'admin']
}