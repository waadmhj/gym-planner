const express = require("express");
const pool = require("../db");
const { requireAuth } = require("../authMiddleware");

const router = express.Router();
router.use(requireAuth);

/* ---------- Weight ---------- */
router.get("/weight", async (req, res) => {
  const result = await pool.query(
    "SELECT * FROM weight_entries WHERE user_id = $1 ORDER BY entry_date ASC",
    [req.session.userId]
  );
  res.json({ entries: result.rows });
});

router.post("/weight", async (req, res) => {
  const { date, weight } = req.body;
  if (!date || !weight) return res.status(400).json({ error: "invalid_input" });
  const result = await pool.query(
    "INSERT INTO weight_entries (user_id, entry_date, weight_kg) VALUES ($1, $2, $3) RETURNING *",
    [req.session.userId, date, weight]
  );
  res.json({ entry: result.rows[0] });
});

router.delete("/weight/:id", async (req, res) => {
  await pool.query("DELETE FROM weight_entries WHERE id = $1 AND user_id = $2", [req.params.id, req.session.userId]);
  res.json({ ok: true });
});

/* ---------- Measurements ---------- */
router.get("/measurements", async (req, res) => {
  const result = await pool.query(
    "SELECT * FROM measurements WHERE user_id = $1 ORDER BY entry_date ASC",
    [req.session.userId]
  );
  res.json({ entries: result.rows });
});

router.post("/measurements", async (req, res) => {
  const { date, chest, waist, abdomen, hips, thigh, arm } = req.body;
  if (!date) return res.status(400).json({ error: "invalid_input" });
  const result = await pool.query(
    `INSERT INTO measurements (user_id, entry_date, chest, waist, abdomen, hips, thigh, arm)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
    [req.session.userId, date, chest || null, waist || null, abdomen || null, hips || null, thigh || null, arm || null]
  );
  res.json({ entry: result.rows[0] });
});

/* ---------- Calendar ---------- */
router.get("/calendar", async (req, res) => {
  const result = await pool.query("SELECT * FROM calendar_entries WHERE user_id = $1", [req.session.userId]);
  res.json({ entries: result.rows });
});

router.put("/calendar/:date", async (req, res) => {
  const { status } = req.body; // "workout" | "done" | "rest" | null
  const userId = req.session.userId;
  const date = req.params.date;
  if (!status) {
    await pool.query("DELETE FROM calendar_entries WHERE user_id = $1 AND entry_date = $2", [userId, date]);
    return res.json({ ok: true });
  }
  await pool.query(
    `INSERT INTO calendar_entries (user_id, entry_date, status) VALUES ($1, $2, $3)
     ON CONFLICT (user_id, entry_date) DO UPDATE SET status = $3`,
    [userId, date, status]
  );
  res.json({ ok: true });
});

module.exports = router;
