const db = require("../config/database");
const bcrypt = require("bcrypt");
const config = require("../utils/config");

class Buyer {
    constructor(fullName, email, password, phoneNumber) {
        this.fullName = fullName;
        this.email = email;
        this.password = password;
        this.phoneNumber = phoneNumber;
    }

    async save() {
        // Hash the password before saving
        this.password = await bcrypt.hash(this.password, parseInt(config.HASH_NUMBER));
        
        // Insert into users table to ensure unique email
        const [userResult] = await db.execute(
            `INSERT INTO users (email) VALUES (?)`,
            [this.email]
        );
        
        const userId = userResult.insertId;
        
        // Insert into buyers table
        return db.execute(
            `INSERT INTO buyers (userId, fullName, password, phoneNumber) VALUES (?, ?, ?, ?)`,
            [userId, this.fullName, this.password, this.phoneNumber]
        );
    }

    static fetchAll() {
        return db.execute("SELECT * FROM buyers");
    }

    static findByEmail(email) {
        return db.execute(
            `SELECT b.*, u.* FROM buyers b
             JOIN users u ON b.userId = u.id
             WHERE u.email = ?`, 
            [email]
        );
    }

    static findById(id) {
        return db.execute("SELECT * FROM buyers WHERE id = ?", [id]);
    }

    static updateActiveStatus(active, id) {
        return db.execute(
            `UPDATE buyers SET active = ? WHERE id = ?`,
            [active, id]
        );
    }


    static async updatePassword(password, id) {
        const newPw = await bcrypt.hash(password, parseInt(config.HASH_NUMBER));
        return db.execute(
            `UPDATE buyers SET password = ? WHERE id = ?`,
            [newPw, id]
        );
    }
}

module.exports = Buyer;
