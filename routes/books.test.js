const request = require('supertest');
const app = require('../app');
const db = require('../db');

process.env.NODE_ENV = "test";

let book1, book2, updatedBook1;

describe('Testing books routes with booksSchema validations', function() {

    beforeEach(async function() {
        await db.query('DELETE FROM books');

        book1 = await db.query(`
            INSERT INTO books (isbn, 
                            amazon_url,
                            author,
                            language,
                            pages,
                            publisher,
                            title,
                            year) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING isbn, 
                    amazon_url,
                    author,
                    language,
                    pages,
                    publisher,
                    title,
                    year`,
            ['0691161555', 
             'http://a.co/eobPtX2/coolBook',
             'Jane Marker',
             'english',
             374,
             'ORiley Press',
             'Coding basics for dummies',
             2017
             ])
        
        book2 = {
            "isbn": "0691161239",
            "amazon_url": "http://a.co/eobPtX2/bookTwo",
            "author": "Tom Harrison",
            "language": "english",
            "pages": 354,
            "publisher": "Harvard University Press",
            "title": "Train the brain for better memory",
            "year": 2020
        }

        updatedBook1 = {
            "isbn": "0691161555",
            "amazon_url": "http://a.co/eobPtX2/newLink",
            "author": "Jane Marker",
            "language": "english",
            "pages": 374,
            "publisher": "ORiley Press",
            "title": "Coding basics for dummies",
            "year": 2017
        }
    })

    describe('GET /books', function() {
        test('get all books', async ()=> {
            const results = await request(app).get('/books');
            expect(results.statusCode).toBe(200);
            expect(results.body).toEqual({"books":[book1.rows[0]]});
        })
    })

    describe('GET /books/:id', function() {
        test('get book by isbn', async ()=> {
            const results = await request(app).get(`/books/${book1.rows[0].isbn}`);
            expect(results.statusCode).toBe(200);
            expect(results.body).toEqual({"book":book1.rows[0]});
        })

        test('get error with wrong isbn /books/:id', async () => {
            const results = await request(app).get(`/books/0691161222`);
            expect(results.statusCode).toBe(404);
        })
    })

    describe('POST /books', function() {
        test('create new book', async ()=> {
            const results = await request(app).post(`/books`).send(book2);
            expect(results.statusCode).toBe(201);
            expect(results.body).toEqual({"book":book2});
        })

        test('get error when creating with missing data /books', async () => {
            const results = await request(app).post(`/books`).send();
            expect(results.statusCode).toBe(400);
        })
        test('get error when creating with missing data /books', async () => {
            const results = await request(app).post(`/books`).send({
                                    "isbn":"0691161111",
                                    "amazon_url": "http://google.com"
                                    });
            expect(results.statusCode).toBe(400);
        })
    })

    describe('PUT /books/:id', function() {
        test('update existing book', async ()=> {
            const results = await request(app).put(`/books/${book1.rows[0].isbn}`).send(updatedBook1);
            expect(results.statusCode).toBe(200);
            expect(results.body).toEqual({"book":{
                    "isbn": "0691161555",
                    "amazon_url": "http://a.co/eobPtX2/newLink",
                    "author": "Jane Marker",
                    "language": "english",
                    "pages": 374,
                    "publisher": "ORiley Press",
                    "title": "Coding basics for dummies",
                    "year": 2017}
            });
        })

        test('get error when updating with wrong book id /books/:id', async () => {
            const results = await request(app).put(`/books/123123123`).send();
            expect(results.statusCode).toBe(400);
        })
        test('get error when updating with missing data /books/:id', async () => {
            const results = await request(app).put(`/books/${book1.rows[0].isbn}`).send();
            expect(results.statusCode).toBe(400);
        })
        test('get error when updating with missing data /books/:id', async () => {
            const results = await request(app).put(`/books/${book1.rows[0].isbn}`).send({
                                    "amazon_url": "http://google.com"
                                    });
            expect(results.statusCode).toBe(400);
        })
    })

    describe('DELETE /books/:id', function() {
        test('delete existing book', async ()=> {
            const results = await request(app).delete(`/books/${book1.rows[0].isbn}`);
            expect(results.statusCode).toBe(200);
            expect(results.body).toEqual({ message: "Book deleted" });
        })

        
        test('get error when id is incorrect /books/:id', async () => {
            const results = await request(app).put(`/books/123123123`);
            expect(results.statusCode).toBe(400);
        })
    })

})

afterAll(async function () {
    await db.end();
  });