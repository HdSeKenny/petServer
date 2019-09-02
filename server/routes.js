const errors = require('./components/errors')
const path = require('path')

const router = function(app){
    app.use('api/article', require('./api/article'))

    //All undefined asset or api routes should return a 404
    app.route('/:url(api|auth|components|app|bower_components|assets)/*').get(errors[404])

    // All other routes should redirect to the app.html
    app.route('/*').get((req, res) => {
        res.sendFile(path.resolve(`${app.get('appPath')}/app.html`))
    })
}

module.exports = router