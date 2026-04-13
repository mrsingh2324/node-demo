const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;
const AUTH_SERVICE_URL =
  process.env.AUTH_SERVICE_URL || "http://auth-service:3001";
const BOOK_SERVICE_URL =
  process.env.BOOK_SERVICE_URL || "http://book-service:3002";

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    service: "api-gateway",
    timestamp: new Date(),
    services: {
      auth: AUTH_SERVICE_URL,
      book: BOOK_SERVICE_URL,
    },
  });
});

const verifyToken = async (req, res, next) => {
  const publicRoutes = ["/api/auth/register", "/api/auth/login", "/health"];
  if (publicRoutes.includes(req.path)) {
    return next();
  }

  const authHeader = req.headers.authorization || "";
  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  try {
    const response = await axios.post(
      `${AUTH_SERVICE_URL}/api/auth/verify`,
      {},
      { headers: { Authorization: `Bearer ${token}` } },
    );

    if (response.data.valid) {
      req.user = response.data;
      return next();
    }

    res.status(401).json({ error: "Invalid token" });
  } catch (error) {
    console.error("Token verification error:", error.message);
    res.status(401).json({ error: "Invalid or expired token" });
  }
};

app.use(verifyToken);

app.post("/api/auth/register", async (req, res) => {
  try {
    const response = await axios.post(
      `${AUTH_SERVICE_URL}/api/auth/register`,
      req.body,
    );
    res.json(response.data);
  } catch (error) {
    const status = error.response?.status || 500;
    const message = error.response?.data || { error: "Auth service error" };
    res.status(status).json(message);
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const response = await axios.post(
      `${AUTH_SERVICE_URL}/api/auth/login`,
      req.body,
    );
    res.json(response.data);
  } catch (error) {
    const status = error.response?.status || 500;
    const message = error.response?.data || { error: "Auth service error" };
    res.status(status).json(message);
  }
});

app.get("/api/books", async (req, res) => {
  try {
    const response = await axios.get(`${BOOK_SERVICE_URL}/api/books`, {
      params: req.query,
    });
    res.json(response.data);
  } catch (error) {
    const status = error.response?.status || 500;
    const message = error.response?.data || { error: "Book service error" };
    res.status(status).json(message);
  }
});

app.get("/api/books/:id", async (req, res) => {
  try {
    const response = await axios.get(
      `${BOOK_SERVICE_URL}/api/books/${req.params.id}`,
    );
    res.json(response.data);
  } catch (error) {
    const status = error.response?.status || 500;
    const message = error.response?.data || { error: "Book service error" };
    res.status(status).json(message);
  }
});

app.post("/api/books", async (req, res) => {
  try {
    const response = await axios.post(
      `${BOOK_SERVICE_URL}/api/books`,
      req.body,
    );
    res.status(201).json(response.data);
  } catch (error) {
    const status = error.response?.status || 500;
    const message = error.response?.data || { error: "Book service error" };
    res.status(status).json(message);
  }
});

app.put("/api/books/:id", async (req, res) => {
  try {
    const response = await axios.put(
      `${BOOK_SERVICE_URL}/api/books/${req.params.id}`,
      req.body,
    );
    res.json(response.data);
  } catch (error) {
    const status = error.response?.status || 500;
    const message = error.response?.data || { error: "Book service error" };
    res.status(status).json(message);
  }
});

app.delete("/api/books/:id", async (req, res) => {
  try {
    const response = await axios.delete(
      `${BOOK_SERVICE_URL}/api/books/${req.params.id}`,
    );
    res.json(response.data);
  } catch (error) {
    const status = error.response?.status || 500;
    const message = error.response?.data || { error: "Book service error" };
    res.status(status).json(message);
  }
});

app.use((err, req, res, next) => {
  console.error("Gateway error:", err);
  res.status(500).json({ error: "Internal gateway error" });
});

app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
  console.log(`Auth Service URL: ${AUTH_SERVICE_URL}`);
  console.log(`Book Service URL: ${BOOK_SERVICE_URL}`);
});
