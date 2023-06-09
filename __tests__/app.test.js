const request = require('supertest')
const app = require('../app.js')
const seed = require('../db/seeds/seed.js')
const db = require('../db/connection.js')
const testData = require('../db/data/test-data/index.js')



beforeEach(() => {
    return seed(testData)
})

afterAll(() => {
    db.end()
})


describe('GET: /api/categories', () => {
    it('responds with correct status code 200', () => {
        return request(app)
            .get('/api/categories')
            .expect(200)
    })
    it('responds with an array of objects with the specified properties', () => {
        return request(app)
            .get('/api/categories')
            .expect(200)
            .then((res) => {
                const categories = res.body.categories
                expect(categories.length).toBe(4)
                categories.forEach((category) => {
                    expect(category).toHaveProperty('slug')
                    expect(category).toHaveProperty('description')
                })
            })
    })
    it('responds with error if incorrect api spelling', () => {
        return request(app)
            .get('/api/cattegories')
            .expect(404)

    })
})

describe('GET: /api', () => {
    it('responds with correct status code 200', () => {
        return request(app)
            .get('/api')
            .expect(200)
    })
    it('gives an object detailing the endpoints available', () => {
        return request(app)
            .get('/api')
            .then((res) => {
                const body = res.body.endpoints
                expect(body).toBeInstanceOf(Object)
                for (const key in body) {
                    expect(body[key]).toHaveProperty('description');
                    expect(body[key]).toHaveProperty('queries'); expect(body[key]).toHaveProperty('exampleResponse');
                }

            })
    })
})

describe('GET: /api/reviews/:review_id', () => {
    it('responds with correct status code 200', () => {
        return request(app)
            .get('/api/reviews/1')
            .expect(200)
    })
    it('gives an object with the following properties', () => {
        return request(app)
            .get('/api/reviews/1')
            .then((res) => {
                const body = res.body.review
                expect(body).toBeInstanceOf(Object)
                const reviewProperties = {
                    review_id: expect.any(Number),
                    title: expect.any(String),
                    review_body: expect.any(String),
                    designer: expect.any(String),
                    review_img_url: expect.any(String),
                    votes: expect.any(Number),
                    category: expect.any(String),
                    owner: expect.any(String),
                    created_at: expect.any(String)
                };
                expect(body).toMatchObject(reviewProperties);


            })
    })
    describe("errors for review api", () => {
        it("returns a 404 if there is no review with the id", () => {
            return request(app)
                .get('/api/reviews/1099')
                .expect(404)
                .then(({ body }) => {
                    expect(body.msg).toBe('Not found')


                })
        })
        it("returns a 404 if given an invalid id", () => {
            return request(app)
                .get('/api/reviews/cat')
                .expect(400)
                .then(({ body }) => {
                    expect(body.msg).toBe('Bad request')


                })
        })
    })
})

describe('GET: /api/reviews', () => {
    it('responds with correct status code 200', () => {
        return request(app)
            .get('/api/reviews')
            .expect(200)
    })
    it('gives an array of objects with the following properties', () => {
        return request(app)
            .get('/api/reviews')
            .expect(200)
            .then((res) => {
                const body = res.body.reviews
                expect(body).toBeInstanceOf(Array)
                const reviewsProperties = {
                    owner: expect.any(String),
                    title: expect.any(String),
                    designer: expect.any(String),
                    review_img_url: expect.any(String),
                    votes: expect.any(Number),
                    category: expect.any(String),
                    created_at: expect.any(String),
                    review_id: expect.any(Number),
                    comment_count: expect.any(Number)
                };
                body.forEach(review => {
                    expect(review).toMatchObject(reviewsProperties);
                });


            })
    })
    it('does not return review_body property', () => {
        return request(app)
            .get('/api/reviews')
            .expect(200)
            .then((res) => {
                const body = res.body.reviews
                expect(body[0]).not.toHaveProperty("review_body");


            })
    })
    it("returns reviews sorted descendingly", () => {
        return request(app)
            .get('/api/reviews')
            .expect(200)
            .then((res) => {
                const body = res.body.reviews
                expect(body).toBeSortedBy('created_at', {
                    descending: true,
                });
            })
    })




    it("returns a 404 if given a bad route", () => {
        return request(app)
            .get('/api/reviewss')
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe('Not found')


            })
    })

})

describe('GET: /api/reviews/:review_id/comments', () => {
    it('responds with correct status code 200', () => {
        return request(app)
            .get('/api/reviews/2/comments')
            .expect(200)
    })
    it('responds with status code 200 and a blank array if given a valid id with no reviews', () => {
        return request(app)
            .get('/api/reviews/1/comments')
            .expect(200)
            .then((res) => {
                const body = res.body.comments
                const emptyArray = []
                expect(body).toEqual(emptyArray)

            })
    })
    it('gives an array of objects with the following properties', () => {
        return request(app)
            .get('/api/reviews/2/comments')
            .then((res) => {
                const body = res.body.comments
                expect(body).toBeInstanceOf(Object)
                const commentProperties = {
                    comment_id: expect.any(Number),
                    review_id: expect.any(Number),
                    body: expect.any(String),
                    votes: expect.any(Number),
                    author: expect.any(String),
                    created_at: expect.any(String)
                };
                body.forEach(comment => {
                    expect(comment).toMatchObject(commentProperties);
                });
            })
    })
    describe("errors for comments api", () => {
        it("returns 404 if there is no review_id", () => {
            return request(app)
                .get('/api/reviews/1099/comments')
                .expect(404)
                .then(({ body }) => {
                    expect(body.msg).toBe('Not found')


                })
        })
        it("returns a 400 if given an invalid id", () => {
            return request(app)
                .get('/api/reviews/cat/comments')
                .expect(400)
                .then(({ body }) => {
                    expect(body.msg).toBe('Bad request')


                })
        })
    })
})

describe('POST: /api/reviews/:review_id/comments', () => {
    it('responds with correct status code 201', () => {
        const newComment = {
            username: 'mallionaire',
            body: 'On the other hand, my turtle hated this game'
        };
        return request(app)
            .post('/api/reviews/2/comments')
            .send(
                newComment
            )
            .expect(201)
            .then((res) => {
                const comment = res.body.comment
                expect(comment).toEqual({
                    body: 'On the other hand, my turtle hated this game',
                    votes: 0,
                    author: 'mallionaire',
                    review_id: 2,
                    created_at: expect.any(String),
                    comment_id: 7
                })
            })
    })

    it('gives an object with the following properties', () => {
        const newComment = {
            username: 'mallionaire',
            body: 'On the other hand, my turtle hated this game'
        }
        return request(app)

            .post('/api/reviews/2/comments')
            .send(newComment)
            .then((res) => {
                const body = res.body.comment

                expect(body).toBeInstanceOf(Object)
                const commentProperties = {
                    comment_id: expect.any(Number),
                    review_id: expect.any(Number),
                    body: expect.any(String),
                    votes: expect.any(Number),
                    author: expect.any(String),
                    created_at: expect.any(String)
                }

                expect(body).toMatchObject(commentProperties);


            })
    })
    describe("errors for posting comments api", () => {
        it("returns 404 if there is no review_id", () => {
            return request(app)
                .post('/api/reviews/1099/comments')
                .expect(404)
                .then(({ body }) => {
                    expect(body.msg).toBe('Not found')


                })
        })
        it("returns a 400 if given an invalid id", () => {
            return request(app)
                .post('/api/reviews/cat/comments')
                .expect(400)
                .then(({ body }) => {
                    expect(body.msg).toBe('Bad request')


                })
        })
        it("returns a 400 if given malformed data ", () => {
            const malformedData = {
                body: 'Wrong',
            }
            return request(app)
                .post('/api/reviews/2/comments')
                .send(malformedData)
                .expect(400)
                .then(({ body }) => {
                    expect(body.msg).toBe('Bad request')


                })
        })
        it("returns a 400 if given incorrect data types ", () => {
            const wrongTypes = {
                body: 7,
                username: 0
            }
            return request(app)
                .post('/api/reviews/cat/comments')
                .send(wrongTypes)
                .expect(400)
                .then(({ body }) => {
                    expect(body.msg).toBe('Bad request')


                })
        })

    })
})

describe('PATCH: /api/reviews/:review_id', () => {
    it('responds with a 201 response code', () => {
        const votes = { inc_votes: 1 }
        return request(app)
            .patch('/api/reviews/2')
            .send(votes)
            .expect(201)
            .then((res) => {
                const votes = res.body.reviews.votes
                expect(votes).toEqual(6)
            })
    })
    it('gives the correct change in votes back for incrementing', () => {
        const votes = { inc_votes: 5 }
        return request(app)
            .patch('/api/reviews/2')
            .send(votes)
            .expect(201)
            .then((res) => {
                const votes = res.body.reviews.votes
                expect(votes).toEqual(10)
            })
    })
    it('gives the correct change in votes back for decrementing', () => {
        const votes = { inc_votes: -5 }
        return request(app)
            .patch('/api/reviews/2')
            .send(votes)
            .expect(201)
            .then((res) => {
                const votes = res.body.reviews.votes
                expect(votes).toEqual(0)
            })
    })
    it('gives an object with the following properties', () => {
        const votes = { inc_votes: 5 }
        return request(app)

            .patch('/api/reviews/2')
            .expect(201)
            .send(votes)
            .then((res) => {
                const body = res.body.reviews
                expect(body).toBeInstanceOf(Object)
                reviewsProperties = {
                    owner: expect.any(String),
                    title: expect.any(String),
                    designer: expect.any(String),
                    review_img_url: expect.any(String),
                    votes: 10,
                    category: expect.any(String),
                    created_at: expect.any(String),
                    review_id: expect.any(Number)
                };
                expect(body).toMatchObject(reviewsProperties);


            })
    })
    describe("errors for updating votes api", () => {
        it("returns 404 if there is no review_id", () => {
            return request(app)
                .patch('/api/reviews/1099')
                .expect(404)
                .then(({ body }) => {
                    expect(body.msg).toBe('Not found')


                })
        })
        it("returns a 400 if given an invalid id", () => {
            return request(app)
                .patch('/api/reviews/cat')
                .expect(400)
                .then(({ body }) => {
                    expect(body.msg).toBe('Bad request')


                })
        })
        it("returns a 400 if given malformed data ", () => {
            const malformedData = {
                h:
                    'k', 9: 'lon'
            }
            return request(app)
                .patch('/api/reviews/2')
                .send(malformedData)
                .expect(400)
                .then(({ body }) => {
                    expect(body.msg).toBe('Bad request')


                })
        })
        it("returns a 400 if given incorrect data types ", () => {
            const wrongTypes = {
                inc_votes: 'lion'
            }
            return request(app)
                .patch('/api/reviews/2')
                .send(wrongTypes)
                .expect(400)
                .then(({ body }) => {
                    expect(body.msg).toBe('Bad request')


                })
        })
    })
})

describe('DELETE: /api/comments/:comment_id', () => {
    it('responds with a 200 response code', () => {

        return request(app)
            .delete('/api/comments/2')
            .expect(200)
            .then((res) => {
                const deleted_id = res.body.deleted.rows[0].comment_id
                rowsDeleted = res.body.deleted.rowCount;
                expect(deleted_id).toEqual(2)
                expect(rowsDeleted).toEqual(1)

            })
    })
    describe("errors for deleting a comment", () => {
        it("returns 404 if there is no comment_id", () => {
            return request(app)
                .delete('/api/comments/2099')
                .expect(404)
                .then(({ body }) => {
                    expect(body.msg).toBe('Not found')

                })
        })
        it("returns a 400 if given an invalid id", () => {
            return request(app)
                .delete('/api/comments/lion')
                .expect(400)
                .then(({ body }) => {
                    expect(body.msg).toBe('Bad request')

                })
        })


    })
})

describe('GET: /api/users', () => {
    it('responds with correct status code 200', () => {
        return request(app)
            .get('/api/users')
            .expect(200)
    })
    it('gives an array of objects with the following properties', () => {
        return request(app)
            .get('/api/users')
            .expect(200)
            .then((res) => {
                const body = res.body.users
                expect(body).toBeInstanceOf(Array)
                const usersProperties = {
                    username: expect.any(String),
                    name: expect.any(String),
                    avatar_url: expect.any(String)
                };
                body.forEach(user => {
                    expect(user).toMatchObject(usersProperties);
                });


            })
    })
    describe("errors for users", () => {
        it("returns a 404 if given a bad route", () => {
            return request(app)
                .get('/api/userss')
                .expect(404)
                .then(({ body }) => {
                    expect(body.msg).toBe('Not found')


                })
        })

    })
})