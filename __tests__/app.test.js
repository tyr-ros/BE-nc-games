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