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
      UNIQUE(userId, videoId),
      FOREIGN KEY(userId) REFERENCES Users(id) ON DELETE CASCADE
    )
  `);
});

module.exports = db;
