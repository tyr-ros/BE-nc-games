const express = require('express')
const { getAllCategories } = require('./controllers/categories-controllers')
const { getEndpoints } = require('./controllers/api.controller')
const app = express()

app.get('/api', getEndpoints)

app.get('/api/categories', getAllCategories)

app.use((err, req, res, next) => {
    res.status(err.status).send({ msg: 'Bad request' })
})



module.exports = app;
