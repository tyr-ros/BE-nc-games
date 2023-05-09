const express = require('express')
const { getAllCategories } = require('./controllers/categories-controllers')
const app = express()



app.get('/api/categories', getAllCategories)

app.use((err, req, res, next) => {
    res.status(err.status).send({ msg: 'Bad request' })
})



module.exports = app;
