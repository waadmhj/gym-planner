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
// HTTP internally. Trusting the first proxy hop lets Express read
// X-Forwarded-Proto, so req.secure (and cookie.secure: "auto" below)
// correctly detect HTTPS instead of assuming every request is insecure.
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
      // "auto" uses req.secure (correct now that trust proxy is set above)
      // to mark the cookie Secure in production while still working over
      // plain HTTP in local dev.
      secure: "auto",
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
