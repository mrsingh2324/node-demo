const express = require("express");
const app = express();
const PORT = process.env.PORT || 3002;

const books = [
  { id: 1, title: "The Art of Microservices", author: "Jane Doe" },
  { id: 2, title: "Node.js in Production", author: "John Smith" },
];

app.get("/health", (req, res) => res.json({ status: "ok", service: "book" }));
app.get("/books", (req, res) => res.json({ books }));

app.listen(PORT, () => {
  console.log(`Book service listening on port ${PORT}`);
});
