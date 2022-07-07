const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController')
const bookController = require("../controllers/bookController")

router.post('/register', userController.createUser)
router.post('/login', userController.loginUser)
router.get('/books/:bookId', bookController.getBook)
router.delete('/books/:bookId', bookController.deleteBook)








module.exports = router;