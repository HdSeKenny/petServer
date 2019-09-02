'use strict'

const express = require('express');
const controller = require('./article.controller');

const router = express.Router()

router.get('/', controller.index);
router.get('/:id', controller.show)
router.post('/', controller.create)
router.put('/:id', controller.upsert)
router.delete('/:id', controller.destroy)

module.exports = router