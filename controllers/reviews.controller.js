const review = require("../db/data/test-data/reviews")
const { fetchReviewById } = require("../models/reviews-models")

exports.getReviewById = (req, res, next) => {
    const { review_id } = req.params;
    fetchReviewById(review_id).then((review) => {
        res.status(200).send({ 'review': review })
    })
        .catch((err) => {
            next(err)
        })
}