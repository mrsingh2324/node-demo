const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3002;

app.use(cors());
app.use(express.json());

let books = [
  {
    id: 1,
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    price: 12.99,
    isbn: "978-0743273565",
    stock: 10,
    createdAt: new Date(),
  },
  {
    id: 2,
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    price: 14.99,
    isbn: "978-0061120084",
    stock: 5,
    createdAt: new Date(),
  },
  {
    id: 3,
    title: "1984",
    author: "George Orwell",
    price: 13.99,
    isbn: "978-0451524935",
    stock: 8,
    createdAt: new Date(),
  },
];

app.get("/health", (req, res) => {
  res.json({ status: "OK", service: "book-service", timestamp: new Date() });
});

app.get("/api/books", (req, res) => {
  const limit = parseInt(req.query.limit || "10", 10);
  const offset = parseInt(req.query.offset || "0", 10);
  const paginatedBooks = books.slice(offset, offset + limit);

  res.json({
    books: paginatedBooks,
    total: books.length,
    limit,
    offset,
  });
});

app.get("/api/books/:id", (req, res) => {
  const book = books.find((b) => b.id === parseInt(req.params.id, 10));
  if (!book) {
    return res.status(404).json({ error: "Book not found" });
  }
  res.json(book);
});

app.post("/api/books", (req, res) => {
  const { title, author, price, isbn, stock } = req.body;

  if (!title || !author || price === undefined) {
    return res
      .status(400)
      .json({ error: "Title, author, and price are required" });
  }

  const newBook = {
    id: books.length + 1,
    title,
    author,
    price: parseFloat(price),
    isbn: isbn || "",
    stock: stock !== undefined ? stock : 0,
    createdAt: new Date(),
  };

  books.push(newBook);

  res.status(201).json({ message: "Book added successfully", book: newBook });
});

app.put("/api/books/:id", (req, res) => {
  const bookId = parseInt(req.params.id, 10);
  const index = books.findIndex((b) => b.id === bookId);
  if (index === -1) {
    return res.status(404).json({ error: "Book not found" });
  }

  const { title, author, price, isbn, stock } = req.body;

  books[index] = {
    ...books[index],
    title: title || books[index].title,
    author: author || books[index].author,
    price: price !== undefined ? parseFloat(price) : books[index].price,
    isbn: isbn || books[index].isbn,
    stock: stock !== undefined ? stock : books[index].stock,
    updatedAt: new Date(),
  };

  res.json({ message: "Book updated successfully", book: books[index] });
});

app.delete("/api/books/:id", (req, res) => {
  const bookId = parseInt(req.params.id, 10);
  const index = books.findIndex((b) => b.id === bookId);
  if (index === -1) {
    return res.status(404).json({ error: "Book not found" });
  }

  books.splice(index, 1);
  res.json({ message: "Book deleted successfully" });
});

app.listen(PORT, () => {
  console.log(`Book Service running on port ${PORT}`);
});
