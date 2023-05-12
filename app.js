const express = require('express')
const { getAllCategories } = require('./controllers/categories-controllers')
const { getEndpoints } = require('./controllers/api.controller')
const { getReviewById, getReviews } = require('./controllers/reviews.controller')
const { getCommentsByReviewId } = require('./controllers/comments-controllers.js')
const app = express()

app.get('/api', getEndpoints)

app.get('/api/categories', getAllCategories)

app.get('/api/reviews/:review_id', getReviewById)

app.get('/api/reviews', getReviews)

app.get('/api/reviews/:review_id/comments', getCommentsByReviewId)

app.use((req, res, next) => {
    res.status(404).send({ msg: 'Not found' });
});

app.use((err, req, res, next) => {
    if (err.status === 404) {
        res.status(404).send({ msg: 'Not found' });
    } else if (err.code === '22P02') {
        res.status(400).send({ msg: 'Bad request' });
    } else if (err.status === 400) {
        res.status(400).send({ msg: 'Bad request' });
    } else {
        res.status(500).send({ msg: 'Internal server error' });
    }
});




module.exports = app;
