const { fetchReviewById, fetchReviews, changeVotes } = require("../models/reviews-models")

exports.getReviewById = (req, res, next) => {
    const { review_id } = req.params;
    fetchReviewById(review_id).then((review) => {
        res.status(200).send({ 'review': review })
    })
        .catch((err) => {
            next(err)
        })
}

exports.getReviews = (req, res, next) => {
    fetchReviews().then((reviews) => {
        res.status(200).send({
            'reviews': reviews
        })

    })
        .catch((err) => {

            next(err)
        })
}

exports.setVotes = (req, res, next) => {
    const { review_id } = req.params
    changeVotes(req.body, review_id)
        .then((reviews) => {
            
            res.status(200).send({ 'reviews': reviews })
        })
        .catch((err) => {
            next(err)
        })
}