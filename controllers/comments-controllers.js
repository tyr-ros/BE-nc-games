
const { fetchCommentsByReviewId, insertCommentByReviewId, deleteCommentById } = require('../models/comments-models')

exports.getCommentsByReviewId = (req, res, next) => {

  const { review_id } = req.params;
  fetchCommentsByReviewId(review_id).then((comments) => {
    res.status(200).send({ 'comments': comments })
  })
    .catch((err) => {
      next(err)
    })
}

exports.postCommentByReviewId = (req, res, next) => {
  const { review_id } = req.params
  insertCommentByReviewId(req.body, review_id)
    .then((comment) => {
      res.status(201).send({ comment })
    })
    .catch((err) => {
      next(err)
    })
}

exports.removeCommentByCommentId = (req, res, next) => {
  const { comment_id } = req.params
  
  deleteCommentById(comment_id)
    .then((deleted) => {
      res.status(200).send({ 'deleted': deleted })
    })
    .catch((err) => {
      next(err)
    })
}  