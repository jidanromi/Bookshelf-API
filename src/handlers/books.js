const { nanoid } = require('nanoid');


const books = []; // in-memory storage


// Helper: build basic book view
function briefView(book) {
    return {
        id: book.id,
        name: book.name,
        publisher: book.publisher,
    };
}

exports.addBook = (req, res) => {
    const {
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
    } = req.body;

    // validation: name
    if (name === undefined || name === null || String(name).trim() === '') {
        return res.status(400).json({
            status: 'fail',
            message: 'Gagal menambahkan buku. Mohon isi nama buku',
        });
    }


    // validation: readPage > pageCount
    if (typeof readPage === 'number' && typeof pageCount === 'number' && readPage > pageCount) {
        return res.status(400).json({
            status: 'fail',
            message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
        });
    }

    const id = nanoid(16);
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;
    const finished = pageCount === readPage;

    const book = {
        id,
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        finished,
        reading: Boolean(reading),
        insertedAt,
        updatedAt,
    };

    books.push(book);


    return res.status(201).json({
        status: 'success',
        message: 'Buku berhasil ditambahkan',
        data: {
            bookId: id,
        },
    });
}

exports.getAllBooks = (req, res) => {
    // optional query: reading (0/1), finished (0/1), name (partial, case-insensitive)
    const { reading, finished, name } = req.query;


    let filtered = books.slice();


    if (reading !== undefined) {
        const r = String(reading) === '1';
        filtered = filtered.filter((b) => Boolean(b.reading) === r);
    }


    if (finished !== undefined) {
        const f = String(finished) === '1';
        filtered = filtered.filter((b) => Boolean(b.finished) === f);
    }


    if (name !== undefined) {
        const q = String(name).toLowerCase();
        filtered = filtered.filter((b) => String(b.name).toLowerCase().includes(q));
    }


    const booksView = filtered.map(briefView);


    return res.status(200).json({ status: 'success', data: { books: booksView } });
};

exports.getBookById = (req, res) => {
    const { bookId } = req.params;
    const book = books.find((b) => b.id === bookId);


    if (!book) {
        return res.status(404).json({ status: 'fail', message: 'Buku tidak ditemukan' });
    }


    return res.status(200).json({ status: 'success', data: { book } });
};

exports.updateBookById = (req, res) => {
    const { bookId } = req.params;
    const {
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
    } = req.body;


    // validation: name
    if (name === undefined || name === null || String(name).trim() === '') {
        return res.status(400).json({ status: 'fail', message: 'Gagal memperbarui buku. Mohon isi nama buku' });
    }


    // validation: readPage > pageCount
    if (typeof readPage === 'number' && typeof pageCount === 'number' && readPage > pageCount) {
        return res.status(400).json({ status: 'fail', message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount' });
    }


    const idx = books.findIndex((b) => b.id === bookId);
    if (idx === -1) {
        return res.status(404).json({ status: 'fail', message: 'Gagal memperbarui buku. Id tidak ditemukan' });
    }


    const updatedAt = new Date().toISOString();
    const finished = pageCount === readPage;


    books[idx] = {
        ...books[idx],
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading: Boolean(reading),
        finished,
        updatedAt,
    };


    return res.status(200).json({ status: 'success', message: 'Buku berhasil diperbarui' });
};

exports.deleteBookById = (req, res) => {
    const { bookId } = req.params;
    const idx = books.findIndex((b) => b.id === bookId);
    if (idx === -1) {
        return res.status(404).json({ status: 'fail', message: 'Buku gagal dihapus. Id tidak ditemukan' });
    }


    books.splice(idx, 1);


    return res.status(200).json({ status: 'success', message: 'Buku berhasil dihapus' });
};