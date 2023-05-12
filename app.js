const express = require('express')
const { getAllCategories } = require('./controllers/categories-controllers')
const { getEndpoints } = require('./controllers/api.controller')
const { getReviewById, getReviews } = require('./controllers/reviews.controller')
const app = express()

app.get('/api', getEndpoints)

app.get('/api/categories', getAllCategories)

app.get('/api/reviews/:review_id', getReviewById)

app.get('/api/reviews', getReviews)

app.use((req, res, next) => {
    res.status(404).send({ msg: 'Not found' });
});

app.use((err, req, res, next) => {
    res.status(404).send({ msg: 'Not found' })
})



module.exports = app;
