const express = require('express')
const { getAllCategories } = require('./controllers/categories-controllers')
const { getEndpoints } = require('./controllers/api.controller')
const { getReviewById } = require('./controllers/reviews.controller')
const app = express()

app.get('/api', getEndpoints)

app.get('/api/categories', getAllCategories)

app.get('/api/reviews/:review_id', getReviewById)

app.use((err, req, res, next) => {
    res.status(404).send({ msg: 'Bad request' })
})



module.exports = app;
