const request = require("supertest");
const app = require("../app");
const db = require("../db");
const Book = require("../models/book")
process.env.NODE_ENV = "test"



describe('Test api routes', ()=>{
    const book ={
        "isbn": "0691161518",
        "amazon_url": "http://a.co/eobPtX2",
        "author": "Matthew Lane",
        "language": "english",
        "pages": 264,
        "publisher": "Princeton University Press",
        "title": "Power-Up: Unlocking the Hidden Mathematics in Video Games",
        "year": 2017
      }
    beforeEach( async ()=>{
        await Book.create(book)

    })
    afterEach( async()=>{
        await db.query('DELETE FROM books')
    })

    test('Books/ get returns list of books', async()=>{
        let result = await request(app).get('/books')
        expect(result.statusCode).toBe(200)
        expect(result.body).toEqual({books:[book]})
    })
    test('/books post creates book',async()=>{
        let result = await request(app).post('/books').send({
            "isbn": "12345",
            "amazon_url": "http://a.co/eobPtX2",
            "author": "Test test",
            "language": "english",
            "pages": 444,
            "publisher": "God",
            "title": "Test title book",
            "year": 4
          })
          expect(result.status).toBe(201)
          expect(result.body).toEqual({book:{
            "isbn": "12345",
            "amazon_url": "http://a.co/eobPtX2",
            "author": "Test test",
            "language": "english",
            "pages": 444,
            "publisher": "God",
            "title": "Test title book",
            "year": 4
          }
        })
    })
    test('/books post invalid doesnt create book',async()=>{
        let result = await request(app).post('/books').send({
            "amazon_url": "http://a.co/eobPtX2",
            "author": "Test test",
            "language": "english",
            "pages": 444,
            "publisher": "God",
            "title": "Test title book",
            "year": 4
        })
        expect(result.status).toBe(400)
        })
    test('/books put updates book', async()=>{
        let result = await request(app).put('/books/0691161518').send({
            "isbn": "0691161518",
            "amazon_url": "http://a.co/eobPtX2",
            "author": "John Tettis",
            "language": "english",
            "pages": 300,
            "publisher": "Princeton University Press",
            "title": "Power-Up: Unlocking the Hidden Mathematics in Video Games",
            "year": 2017
          })
        expect(result.status).toBe(200)
        expect(result.body).toEqual({book:{
            "isbn": "0691161518",
            "amazon_url": "http://a.co/eobPtX2",
            "author": "John Tettis",
            "language": "english",
            "pages": 300,
            "publisher": "Princeton University Press",
            "title": "Power-Up: Unlocking the Hidden Mathematics in Video Games",
            "year": 2017
            }
        })
    })
    test('/books put invalid returns error', async()=>{
        let result = await request(app).put('/books/0691161518').send({
            "isbn": "0691161518",
            "amazon_url": "http://a.co/eobPtX2",
            "author": "John Tettis",
            "language": "english",
            "pages": 300,
            "publisher": "Princeton University Press"
          })
        expect(result.status).toBe(400)
        
    })
    test('books/ delete',async()=>{
        let result = await request(app).delete("/books/0691161518")
        console.log(result)
        expect(result.status).toBe(200)
    
    })
})
