
const { fetchCommentsByReviewId } = require('../models/comments-models')

exports.getCommentsByReviewId = (req, res, next) => {

    const { review_id } = req.params;
    fetchCommentsByReviewId(review_id).then((comments) => {
        res.status(200).send({ 'comments': comments })
    })
        .catch((err) => {
            next(err)
        })
}