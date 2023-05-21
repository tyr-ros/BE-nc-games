const db = require('../db/connection')
const { checkReviewIdExists } = require('../db/seeds/utils')

exports.fetchReviewById = (review_id) => {
    return db
        .query('SELECT * FROM reviews WHERE review_id = $1;', [review_id])
        .then((result) => {
            if (result.rows.length === 0) {
                return Promise.reject({ status: 404 })
            }
            return result.rows[0]
        })
}

exports.fetchReviews = () => {
    return db
        .query(`SELECT 
        r.owner,
        r.title,
        r.review_id,
        r.category,
        r.review_img_url,
        r.created_at,
        r.votes,
        r.designer,
        COUNT(c.comment_id) :: INT as comment_count
        FROM REVIEWS r
        LEFT JOIN COMMENTS c ON r.review_id = c.review_id
        GROUP BY r.review_id
        ORDER BY r.created_at DESC;`)
        .then((result) => {
            if (result.rows.length === 0) {
                return Promise.reject({ status: 404 })
            }
            return result.rows
        })
}

exports.changeVotes = (voteObject, review_id) => {

    const votes = voteObject.inc_votes
    const queryStr =
        `UPDATE reviews
        SET votes = votes + $1
        WHERE review_id = $2
        RETURNING *; `
    const queryVals = [votes, review_id]
    return checkReviewIdExists(review_id)
        .then(() => {
            return db.query(queryStr, queryVals)

        })
        .then((res) => {
            
            return res.rows[0]
        })
}