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