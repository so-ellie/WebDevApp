const db = require("../config/db");
const Favorite = require("../models/favorite");

class FavoriteRepository {
  async findAllByUserId(userId) {
    return new Promise((resolve, reject) => {
      db.all(
        `SELECT * FROM Favorites WHERE userId = ? ORDER BY createdAt DESC`,
        [userId],
        (err, rows) => {
          if (err) return reject(err);
          resolve(rows.map((r) => new Favorite(r)));
        },
      );
    });
  }

  async findById(id) {
    return new Promise((resolve, reject) => {
      db.get(`SELECT * FROM Favorites WHERE id = ?`, [id], (err, row) => {
        if (err) return reject(err);
        resolve(row ? new Favorite(row) : null);
      });
    });
  }

  async create({ userId, videoId, title, thumbnail, description }) {
    const createdAt = new Date().toISOString();
    return new Promise((resolve, reject) => {
      db.run(
        `INSERT INTO Favorites (userId, videoId, title, thumbnail, description, createdAt) VALUES (?, ?, ?, ?, ?, ?)`,
        [userId, videoId, title, thumbnail, description, createdAt],
        function (err) {
          if (err) return reject(err);
          resolve(
            new Favorite({
              id: this.lastID,
              userId,
              videoId,
              title,
              thumbnail,
              description,
              createdAt,
            }),
          );
        },
      );
    });
  }

  async deleteById(id, userId) {
    return new Promise((resolve, reject) => {
      db.run(
        `DELETE FROM Favorites WHERE id = ? AND userId = ?`,
        [id, userId],
        function (err) {
          if (err) return reject(err);
          resolve(this.changes > 0);
        },
      );
    });
  }
}

module.exports = new FavoriteRepository();
