const express = require("express");
const bcrypt = require("bcryptjs");
const pool = require("../db");
const { requireAuth } = require("../authMiddleware");

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password || password.length < 6) {
      return res.status(400).json({ error: "invalid_input", message: "Email and a password of at least 6 characters are required." });
    }
    const existing = await pool.query("SELECT id FROM users WHERE email = $1", [email.toLowerCase()]);
    if (existing.rows.length) {
      return res.status(409).json({ error: "email_taken" });
    }
    const hash = await bcrypt.hash(password, 10);
    const result = await pool.query(
      "INSERT INTO users (email, password_hash, name) VALUES ($1, $2, $3) RETURNING id, email, name",
      [email.toLowerCase(), hash, name || null]
    );
    const user = result.rows[0];
    req.session.userId = user.id;
    res.json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "server_error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [(email || "").toLowerCase()]);
    const user = result.rows[0];
    if (!user) return res.status(401).json({ error: "invalid_credentials" });
    const ok = await bcrypt.compare(password || "", user.password_hash);
    if (!ok) return res.status(401).json({ error: "invalid_credentials" });
    req.session.userId = user.id;
    res.json({ user: { id: user.id, email: user.email, name: user.name } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "server_error" });
  }
});

router.post("/logout", (req, res) => {
  req.session.destroy(() => res.json({ ok: true }));
});

router.get("/me", requireAuth, async (req, res) => {
  const userResult = await pool.query("SELECT id, email, name FROM users WHERE id = $1", [req.session.userId]);
  const profileResult = await pool.query("SELECT * FROM profiles WHERE user_id = $1", [req.session.userId]);
  res.json({
    user: userResult.rows[0] || null,
    profile: profileResult.rows[0] || null,
  });
});

module.exports = router;
