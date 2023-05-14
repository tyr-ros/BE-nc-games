const db = require('../db/connection')
const { checkReviewExists } = require("../db/seeds/utils.js");

exports.fetchCommentsByReviewId = (review_id) => {
  return checkReviewExists(review_id)
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

// exports.makeNewComment
