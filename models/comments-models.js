const db = require('../db/connection')
const { checkReviewIdExists } = require("../db/seeds/utils.js");

exports.fetchCommentsByReviewId = (review_id) => {
  return checkReviewIdExists(review_id)
    .then(() => {
      return db.query(
        `
    SELECT * FROM comments WHERE review_id = $1 ORDER BY created_at DESC;
    `,
        [review_id]
      );
    })
    .then((res) => {
      return res.rows;
    });
};

exports.insertCommentByReviewId = (comment, review_id) => {
  const { username, body } = comment
  const queryStr =
    "INSERT INTO comments (author, body, review_id) VALUES ($1, $2, $3) RETURNING *;"
  const queryVals = [username, body, review_id]

  return checkReviewIdExists(review_id)
    .then(() => {
      return db.query(queryStr, queryVals)
    })
    .then((res) => {

      return res.rows[0]
    })
}
