const db = require("../config/db");
const Favorite = require("../models/favorite");

class FavoriteRepository {
  async findAllByUserId(userId) {
    return new Promise((resolve, reject) => {
      db.all(
        `SELECT * FROM Favorites WHERE userId = ? ORDER BY ord ASC, createdAt DESC`,
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

    // determine next ord for this user
    const nextOrd = await new Promise((resolve, reject) => {
      db.get(
        `SELECT COALESCE(MAX(ord), 0) + 1 as next FROM Favorites WHERE userId = ?`,
        [userId],
        (err, row) => {
          if (err) return reject(err);
          resolve(row ? row.next : 1);
        },
      );
    });

    return new Promise((resolve, reject) => {
      db.run(
        `INSERT INTO Favorites (userId, videoId, title, thumbnail, description, createdAt, ord) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [userId, videoId, title, thumbnail, description, createdAt, nextOrd],
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
              ord: nextOrd,
            }),
          );
        },
      );
    });
  }

  async updateOrder(userId, orderedIds) {
    return new Promise((resolve, reject) => {
      db.serialize(() => {
        const stmt = db.prepare(
          `UPDATE Favorites SET ord = ? WHERE id = ? AND userId = ?`,
        );
        let pos = 1;
        for (const id of orderedIds) {
          stmt.run(pos, id, userId);
          pos++;
        }
        stmt.finalize((err) => {
          if (err) return reject(err);
          resolve(true);
        });
      });
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
