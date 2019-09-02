'use strict'

const mongoose = require('mongoose')

const ArticleSchema = new mongoose.Schema({
    title: String,
    author: String,
    avatarUrl: String,
    like: Number,
    imgSrc: Array,
    videoSrc: String,
    content: String,
    createDate: Date,
    updateDate: Date
})

module.exports = mongoose.model('Article', ArticleSchema)