# expressBooks

This projects contains an example of Express app that works with JSON Schema.

## Structure: 
- models/books.js - is a Book class that does database queries for CRUD data workflow
- routes/books.js - are the routes for getting all books, book by id, add new book, update book, delete book.
- routes/books.test.js - tests books routes using Jest
- schemas/bookSchema.json - is our JSON schema that we use for data validation when adding new book or updating a book.
- app.js - manages routes
- config.js - manages connections to database based on test or development environment
- data.sql - is our database schema
- db.js - manages connection to databse using config.js and pg library
- expressError.js - custom error handler
- server.js - starts the server

## Data validations: 
this is our JSON data with all required fields

``
{
  "isbn": "0691161518",
  "amazon_url": "http://a.co/eobPtX2",
  "author": "Matthew Lane",
  "language": "english",
  "pages": 264,
  "publisher": "Princeton University Press",
  "title": "Power-Up: Unlocking the Hidden Mathematics in Video Games",
  "year": 2017
}
``

I used https://jsonschema.net to create a JSON schema

helpful document
 https://json-schema.org/understanding-json-schema
