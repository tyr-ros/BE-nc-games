const db = require('../db/connection')
const comments = require('../db/data/test-data/comments')

exports.fetchCommentsByReviewId = (review_id) => {
    return db.query(`SELECT * FROM reviews WHERE review_id = $1`, [review_id])
        .then((result) => {
            if (result.rows.length === 0) {
                return Promise.reject({ status: 404 })
            } else {
                return db
                    .query(`SELECT comment_id, votes, created_at, author, body, review_id
                FROM comments
                WHERE review_id = $1
                ORDER BY created_at DESC;
                `, [review_id])
                    .then((result) => {
                    
                        return result.rows
                    })
            }
        })
}