/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/articles              ->  index
 * POST    /api/articles              ->  create
 * GET     /api/articles/:id          ->  show
 * PUT     /api/articles/:id          ->  upsert
 * DELETE  /api/articles/:id          ->  destroy
 */
'use strict'
const Article = require('./article.model')

function respondWithResult(res, statusCode){
    statusCode = statusCode || 200
    return function(entity){
        if(entity){
            return res.status(statusCode).json(entity)
        }
        return null
    }
}

function removeEntity(res){
    return function(entity){
        if(entity){
            return entity.remove().then(() => res.status(204).end())
        }
    }
}

function handleEntityNotFound(res) {
    return function(entity) {
      if (!entity) {
        res.status(404).end()
        return null
      }
      return entity
    }
}

function handleError(res, statusCode){
    statusCode = statusCode || 500
    return function(err){
        res.status(statusCode).send(err)
    }
}

//Gets a list of articles
exports.index = function(req, res) {
    return Article
        .find()
        .exec()
        .then(respondWithResult(res))
        .catch(handleError(res))
}

// Gets a single Article from the DB
exports.show = function(req, res) {
    return Article.findById(req.params.id)
      .exec()
      .then(handleEntityNotFound(res))
      .then(respondWithResult(res))
      .catch(handleError(res))
}

//Create a new Article in DB
exports.create = function(req, res){
    return Article.create(req.body)
        .then(respondWithResult(res, 201))
        .catch(handleError(res))
}

//Upserts the given Article in the DB at the specified ID
exports.upsert = function(req, res){
    if(req.body._id){
        Reflect.deleteProperty(req.body, '_id')
    }
    return Article.findOneAndUpdate({ _id: req.params.id}, req.body, {
        new: true, 
        upsert: true,
        setDefaultsOnInsert: true,
        runValidators: true
    })
    .exec()
    .then(respondWithResult(res))
    .catch(handleError(res))
}

//Delete a Article from DB
exports.destroy = function(req, res){
    return Article.findById(req.params.id)
        .exec()
        .then(handleEntityNotFound(res))
        .then(removeEntity(res))
        .catch(handleError(res))
}
  