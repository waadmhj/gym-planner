const express = require("express");
const pool = require("../db");
const { requireAuth } = require("../authMiddleware");

const router = express.Router();
router.use(requireAuth);

/* ---------- Profile ---------- */
router.post("/profile", async (req, res) => {
  const { age, height, weight, goals, daysPerWeek } = req.body;
  const userId = req.session.userId;
  await pool.query(
    `INSERT INTO profiles (user_id, age, height_cm, weight_kg, goals, days_per_week, updated_at)
     VALUES ($1, $2, $3, $4, $5, $6, now())
     ON CONFLICT (user_id) DO UPDATE SET
       age = EXCLUDED.age, height_cm = EXCLUDED.height_cm, weight_kg = EXCLUDED.weight_kg,
       goals = EXCLUDED.goals, days_per_week = EXCLUDED.days_per_week, updated_at = now()`,
    [userId, age || null, height || null, weight || null, goals || [], daysPerWeek || null]
  );
  if (weight) {
    await pool.query(
      `INSERT INTO weight_entries (user_id, entry_date, weight_kg) VALUES ($1, CURRENT_DATE, $2)`,
      [userId, weight]
    );
  }
  res.json({ ok: true });
});

/* ---------- Schedule: day-by-day wizard ----------
   The wizard calls POST /schedule/days once per day the user describes,
   then POST /schedule/days/:dayId/exercises once per exercise they add
   to that day — nothing is invented, only what the user types is stored. */

router.get("/schedule", async (req, res) => {
  const userId = req.session.userId;
  const days = await pool.query(
    "SELECT * FROM training_days WHERE user_id = $1 ORDER BY day_order ASC",
    [userId]
  );
  const dayIds = days.rows.map((d) => d.id);
  let exercisesByDay = {};
  if (dayIds.length) {
    const exercises = await pool.query(
      "SELECT * FROM exercises WHERE day_id = ANY($1) ORDER BY ex_order ASC",
      [dayIds]
    );
    const statuses = await pool.query(
      "SELECT exercise_id, completed FROM exercise_status WHERE user_id = $1",
      [userId]
    );
    const statusMap = {};
    statuses.rows.forEach((s) => (statusMap[s.exercise_id] = s.completed));
    exercises.rows.forEach((ex) => {
      ex.completed = !!statusMap[ex.id];
      if (!exercisesByDay[ex.day_id]) exercisesByDay[ex.day_id] = [];
      exercisesByDay[ex.day_id].push(ex);
    });
  }
  const result = days.rows.map((d) => ({ ...d, exercises: exercisesByDay[d.id] || [] }));
  res.json({ days: result });
});

router.post("/schedule/days", async (req, res) => {
  const userId = req.session.userId;
  const { nameAr, nameEn, dayOrder } = req.body;
  const result = await pool.query(
    "INSERT INTO training_days (user_id, day_order, name_ar, name_en) VALUES ($1, $2, $3, $4) RETURNING *",
    [userId, dayOrder, nameAr || null, nameEn || null]
  );
  res.json({ day: result.rows[0] });
});

router.delete("/schedule/days/:dayId", async (req, res) => {
  const userId = req.session.userId;
  await pool.query("DELETE FROM training_days WHERE id = $1 AND user_id = $2", [req.params.dayId, userId]);
  res.json({ ok: true });
});

router.post("/schedule/days/:dayId/exercises", async (req, res) => {
  const userId = req.session.userId;
  const dayId = req.params.dayId;
  const owns = await pool.query("SELECT id FROM training_days WHERE id = $1 AND user_id = $2", [dayId, userId]);
  if (!owns.rows.length) return res.status(404).json({ error: "day_not_found" });

  const { nameAr, nameEn, equipmentAr, equipmentEn, sets, reps, rest, exOrder } = req.body;
  const result = await pool.query(
    `INSERT INTO exercises (day_id, ex_order, name_ar, name_en, equipment_ar, equipment_en, sets, reps, rest, video_url)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,'') RETURNING *`,
    [dayId, exOrder, nameAr || null, nameEn || null, equipmentAr || null, equipmentEn || null, sets || null, reps || null, rest || null]
  );
  res.json({ exercise: result.rows[0] });
});

router.delete("/exercises/:exerciseId", async (req, res) => {
  const userId = req.session.userId;
  await pool.query(
    `DELETE FROM exercises WHERE id = $1 AND day_id IN (SELECT id FROM training_days WHERE user_id = $2)`,
    [req.params.exerciseId, userId]
  );
  res.json({ ok: true });
});

router.put("/exercises/:exerciseId/video", async (req, res) => {
  const userId = req.session.userId;
  const { videoUrl } = req.body;
  await pool.query(
    `UPDATE exercises SET video_url = $1
     WHERE id = $2 AND day_id IN (SELECT id FROM training_days WHERE user_id = $3)`,
    [videoUrl || "", req.params.exerciseId, userId]
  );
  res.json({ ok: true });
});

router.put("/exercises/:exerciseId/toggle", async (req, res) => {
  const userId = req.session.userId;
  const { completed } = req.body;
  await pool.query(
    `INSERT INTO exercise_status (user_id, exercise_id, completed, updated_at)
     VALUES ($1, $2, $3, now())
     ON CONFLICT (user_id, exercise_id) DO UPDATE SET completed = $3, updated_at = now()`,
    [userId, req.params.exerciseId, !!completed]
  );
  res.json({ ok: true });
});

module.exports = router;
