const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbPath = path.join(__dirname, "..", "db.sqlite");
const db = new sqlite3.Database(dbPath);

// Create Users table in SQLite database
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS Users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      fullName TEXT NOT NULL,
      passwordHash TEXT NOT NULL,
      createdAt TEXT NOT NULL
    )
  `);

  // Create Favorites table
  db.run(`
    CREATE TABLE IF NOT EXISTS Favorites (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER NOT NULL,
      videoId TEXT NOT NULL,
      title TEXT NOT NULL,
      thumbnail TEXT,
      description TEXT,
      createdAt TEXT NOT NULL,
      ord INTEGER DEFAULT 0,
      UNIQUE(userId, videoId),
      FOREIGN KEY(userId) REFERENCES Users(id) ON DELETE CASCADE
    )
  `);

  // Ensure 'ord' column exists for older DBs; if missing, add it and initialize per-user ordering by createdAt
  db.all("PRAGMA table_info(Favorites)", (err, cols) => {
    if (err) return;
    if (!cols.some((c) => c.name === "ord")) {
      db.run("ALTER TABLE Favorites ADD COLUMN ord INTEGER", (err) => {
        if (err) return;
        // initialize ord sequentially per user based on createdAt
        db.all(
          "SELECT id, userId FROM Favorites ORDER BY userId, createdAt ASC",
          (err, rows) => {
            if (err) return;
            let lastUser = null;
            let pos = 0;
            const updateStmt = db.prepare(
              "UPDATE Favorites SET ord = ? WHERE id = ?",
            );
            rows.forEach((r) => {
              if (lastUser !== r.userId) {
                lastUser = r.userId;
                pos = 1;
              } else {
                pos++;
              }
              updateStmt.run(pos, r.id);
            });
            updateStmt.finalize();
          },
        );
      });
    }
  });
});

module.exports = db;
