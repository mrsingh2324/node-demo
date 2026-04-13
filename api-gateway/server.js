const express = require("express");
const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3000;
const AUTH_URL = process.env.AUTH_URL || "http://auth-service:3001";
const BOOK_URL = process.env.BOOK_URL || "http://book-service:3002";

function copyResponseHeaders(source, target) {
  source.forEach((value, name) => {
    if (name.toLowerCase() === "content-length") return;
    target.setHeader(name, value);
  });
}

app.get("/health", (req, res) =>
  res.json({ status: "ok", service: "api-gateway" }),
);

app.use("/auth", async (req, res) => {
  const url = `${AUTH_URL}${req.path}`;
  const response = await fetch(url, {
    method: req.method,
    headers: { ...req.headers, host: new URL(AUTH_URL).host },
    body: ["GET", "HEAD"].includes(req.method)
      ? undefined
      : JSON.stringify(req.body),
  });
  const body = await response.text();
  copyResponseHeaders(response.headers, res);
  res.status(response.status).send(body);
});

app.use("/books", async (req, res) => {
  const url = `${BOOK_URL}${req.path}${req.url.includes("?") ? req.url.slice(req.url.indexOf("?")) : ""}`;
  const response = await fetch(url, {
    method: req.method,
    headers: { ...req.headers, host: new URL(BOOK_URL).host },
    body: ["GET", "HEAD"].includes(req.method)
      ? undefined
      : JSON.stringify(req.body),
  });
  const body = await response.text();
  copyResponseHeaders(response.headers, res);
  res.status(response.status).send(body);
});

app.listen(PORT, () => {
  console.log(`API gateway listening on port ${PORT}`);
});
