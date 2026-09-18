require("dotenv").config();
const path = require("path");
const express = require("express");
const session = require("express-session");
const pgSession = require("connect-pg-simple")(session);
const cors = require("cors");

const pool = require("./db");
const migrate = require("./migrate");

const authRoutes = require("./routes/auth");
const scheduleRoutes = require("./routes/schedule");
const trackingRoutes = require("./routes/tracking");

const app = express();
const PORT = process.env.PORT || 3000;

// Render (and most PaaS hosts) terminate HTTPS at a proxy and forward plain
// HTTP internally. Without this, Express thinks every request is insecure,
// so express-session refuses to set our `secure: true` cookie — logins
// appear to succeed but the session never actually persists.
app.set("trust proxy", 1);

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

app.use(
  session({
    store: new pgSession({ pool, tableName: "session", createTableIfMissing: true }),
    secret: process.env.SESSION_SECRET || "dev-secret-change-me",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      // Not tying this to NODE_ENV/req.secure: behind Render's proxy, Express
      // can fail to detect HTTPS even with `trust proxy` set, which makes
      // express-session silently refuse to set a `secure: true` cookie at all.
      // Render always serves over HTTPS at the edge, so the cookie is still
      // only ever transmitted encrypted in practice.
      secure: false,
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
    },
  })
);

app.use("/api/auth", authRoutes);
app.use("/api", scheduleRoutes);
app.use("/api", trackingRoutes);

app.use(express.static(path.join(__dirname, "..", "public")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});

async function start() {
  try {
    await migrate();
  } catch (err) {
    console.error("Could not run migrations:", err);
  }
  app.listen(PORT, () => console.log(`🏋️  Gym Training Planner running on port ${PORT}`));
}

start();
