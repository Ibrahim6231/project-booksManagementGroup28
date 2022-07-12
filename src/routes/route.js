const express = require('express');
const router = express.Router();
const {createUser, loginUser}= require('../controllers/userController')
const {getBook, createBooks, booksByQuery, deleteBook, updateBook} = require('../controllers/bookController')
const {createReview, updateReview, deleteReview} = require('../controllers/reviewController')
const {validateUser, validateBooks} = require('../middlewares/commonMiddlewares')
const {authentication, authorisation} = require('../middlewares/auth')

//user api
router.post('/register', validateUser, createUser)
router.post('/login', loginUser)

// //books api
// router.post('/books', authentication, authorisation, validateBooks,  createBooks)
router.post('/books', authentication, validateBooks,  authorisation, createBooks)
router.get('/books', authentication, booksByQuery)
router.get('/books/:bookId', authentication, getBook)
router.put('/books/:bookId', updateBook)
router.delete('/books/:bookId', deleteBook)

// router.get('/books', bookController.booksByQuery)



//review api
router.post('/books/:bookId/review', createReview)
router.put('/books/:bookId/review', updateReview)
router.delete('/books/:bookId/review', deleteReview)







module.exports = router;