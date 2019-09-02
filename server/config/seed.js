/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict'
const Article = require('../api/article/article.model')
const config = require('./environment')

const seedDatabaseIfNeeded = function () {
  if (!config.seedDB) {
    return Promise.resolve()
  }

  const articlePromise = Article.find({})
    .remove()
    .then(() =>
    Article.create(
        {
          title: '可爱的小猫咪',
          author: 'jenny',
          avatarUrl: '',
          like: 12,
          imgSrc: [''],
          videoSrc: '',
          content: '老夫的少女心都快被融化了',
          createDate: new Date()
        }
      )
    )
    .then(() => console.log('finished populating articles'))
    .catch((err) => console.log('error populating articles', err))

  return Promise.all([
    articlePromise
  ])
}
module.exports = seedDatabaseIfNeeded