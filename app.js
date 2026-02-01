// Load .env file (if present)
require("dotenv").config();
// Warn on missing/placeholder API key to help debug 403 issues
if (
  !process.env.YOUTUBE_API_KEY ||
  process.env.YOUTUBE_API_KEY.startsWith("YOUR_")
) {
  console.warn(
    "\x1b[33mWarning:\x1b[0m YOUTUBE_API_KEY is not set or uses the placeholder. YouTube searches may fail with 403. See YOUTUBE.md for details.",
  );
}
const express = require("express");
const path = require("path");
const sessionMiddleware = require("./config/session");
const authRoutes = require("./routes/authRoutes");
const videoRoutes = require("./routes/videoRoutes");
const requireAuth = require("./middleware/requireAuth");

const app = express();

// view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// body parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // for JSON requests (reorder requests from client-side JS)

// sessions
app.use(sessionMiddleware);

// make user available in views
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

// routes
app.use(authRoutes);
app.use(videoRoutes);

// protected home
app.get("/", requireAuth, (req, res) => {
  res.render("home", { user: req.session.user });
});

// fallback
app.use((req, res) => {
  res.status(404).send("Not Found");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
