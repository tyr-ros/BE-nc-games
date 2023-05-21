const db = require('../db/connection')

exports.fetchUsers = () => {
    return db
        .query(`SELECT username, name, avatar_url      
        FROM USERS`)
        .then((result) => {
            if (result.rows.length === 0) {
                return Promise.reject({ status: 404 })
            }
            return result.rows
        })
}