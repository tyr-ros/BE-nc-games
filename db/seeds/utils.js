const db = require('../connection')

exports.convertTimestampToDate = ({ created_at, ...otherProperties }) => {
	if (!created_at) return { ...otherProperties };
	return { created_at: new Date(created_at), ...otherProperties };
};

exports.createRef = (arr, key, value) => {
	return arr.reduce((ref, element) => {
		ref[element[key]] = element[value];
		return ref;
	}, {});
};

exports.formatComments = (comments, idLookup) => {
	return comments.map(({ created_by, belongs_to, ...restOfComment }) => {
		const article_id = idLookup[belongs_to];
		return {
			article_id,
			author: created_by,
			...this.convertTimestampToDate(restOfComment),
		};
	});
};

exports.checkReviewIdExists = (review_id) => {
	return db.query(
		`SELECT * FROM reviews WHERE review_id = $1;`,
		[review_id]
	)
		.then((res) => {
			if (res.rows.length === 0) {
				return Promise.reject({ status: 404 });
			}
		})
}

exports.checkCommentIdExists = (comment_id) => {
	
	return db.query(
		`SELECT * FROM comments
		WHERE comment_id = $1;`,
		[comment_id]
	)
		.then((res) => {
			
			if (res.rows.length === 0) {
				return Promise.reject({
					status: 404

				})
			}
		})
}