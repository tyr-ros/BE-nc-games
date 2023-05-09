
const { fetchCategories } = require('../models/categories-models')

exports.getAllCategories = (req, res, next) => {
    fetchCategories().then((categories) => {
        res.status(200).send({ 'categories': categories.rows })
    })
        .catch((err) => {
            next(err)
        })
}