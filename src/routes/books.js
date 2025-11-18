const express = require('express');
const router = express.Router();
const handlers = require('../handlers/books');


router.post('/', handlers.addBook);
router.get('/', handlers.getAllBooks);
router.get('/:bookId', handlers.getBookById);
router.put('/:bookId', handlers.updateBookById);
router.delete('/:bookId', handlers.deleteBookById);


module.exports = router;