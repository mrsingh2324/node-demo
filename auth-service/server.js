const express = require("express");
const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3001;

const users = [];

app.get("/health", (req, res) => res.json({ status: "ok", service: "auth" }));

app.post("/register", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "email and password are required" });
  }
  if (users.some((user) => user.email === email)) {
    return res.status(409).json({ error: "user already exists" });
  }
  users.push({ email, password });
  res.status(201).json({ message: "user registered" });
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  const user = users.find((u) => u.email === email && u.password === password);
  if (!user) {
    return res.status(401).json({ error: "invalid credentials" });
  }
  res.json({ message: "login successful", token: "demo-token" });
});

app.listen(PORT, () => {
  console.log(`Auth service listening on port ${PORT}`);
});
