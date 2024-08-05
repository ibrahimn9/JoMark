const db = require("../config/database");
const bcrypt = require("bcrypt");
const config = require("../utils/config");

class Seller {
  constructor(fullName, email, password, phoneNumber) {
    this.fullName = fullName;
    this.email = email;
    this.password = password;
    this.phoneNumber = phoneNumber;
  }

  async save() {
    // Hash the password before saving
    this.password = await bcrypt.hash(
      this.password,
      parseInt(config.HASH_NUMBER)
    );

    // Insert into users table to ensure unique email
    const [userResult] = await db.execute(
      `INSERT INTO users (email) VALUES (?)`,
      [this.email]
    );

    const userId = userResult.insertId;

    // Insert into sellers table
    return db.execute(
      `INSERT INTO sellers (userId, fullName, password, phoneNumber) VALUES (?, ?, ?, ?)`,
      [userId, this.fullName, this.password, this.phoneNumber]
    );
  }

  static fetchAll() {
    return db.execute("SELECT * FROM sellers");
  }

  static findByEmail(email) {
    return db.execute(
      `SELECT s.* FROM sellers s
             JOIN users u ON s.userId = u.id
             WHERE u.email = ?`,
      [email]
    );
  }

  static findById(id) {
    return db.execute("SELECT * FROM sellers WHERE id = ?", [id]);
  }

  static updateActiveStatus(active, id) {
    return db.execute(`UPDATE sellers SET active = ? WHERE id = ?`, [
      active,
      id,
    ]);
  }

  static async updatePassword(password, id) {
    const newPw = await bcrypt.hash(password, parseInt(config.HASH_NUMBER));
    return db.execute(`UPDATE sellers SET password = ? WHERE id = ?`, [
      newPw,
      id,
    ]);
  }
}

module.exports = Seller;
