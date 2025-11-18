const express = require('express');
const bodyParser = require('body-parser');
const booksRouter = require('./routes/books');


const app = express();
const PORT = process.env.PORT || 9000;


app.use(bodyParser.json());


app.use('/books', booksRouter);


// 404 for unknown routes (simple JSON)
app.use((req, res) => {
res.status(404).json({ status: 'fail', message: 'Route not found' });
});


app.listen(PORT, () => {
console.log(`Bookshelf API listening on port ${PORT}`);
});