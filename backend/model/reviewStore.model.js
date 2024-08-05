const db = require("../config/database");

class ReviewStore {
    constructor(rating, text, storeId, buyerId) {
        this.rating = rating;
        this.text = text;
        this.storeId = storeId;
        this.buyerId = buyerId;
    }

    async save() {
        return db.execute(
            `INSERT INTO reviewStore (rating, text, storeId, buyerId) VALUES (?, ?, ?, ?)`,
            [this.rating, this.text, this.storeId, this.buyerId]
        );
    }

    static fetchAll() {
        return db.execute("SELECT * FROM reviewStore");
    }
    static ReviewerExist(storeId,buyerId){
        return db.execute("SELECT * from reviewStore where ? in (SELECT r1.buyerId from reviewStore r1 where r1.storeId = ?)",[buyerId,storeId])
    }

    static findByStoreId(storeId) {
        return db.execute("SELECT * FROM reviewStore WHERE storeId = ?", [storeId]);
    }

    static findByBuyerId(buyerId) {
        return db.execute("SELECT * FROM reviewStore WHERE buyerId = ?", [buyerId]);
    }
    
    static async rateAVG(storeId) {
        const [rows] = await db.execute("SELECT avg(rating) as averageRating FROM reviewStore WHERE storeId = ?", [storeId]);
        if (rows.length > 0) {
            return rows[0].averageRating;
        } else {
            return null; 
        }
    }

    static updateReview(id, rating, text) {
        return db.execute(
            `UPDATE reviewStore SET rating = ?, text = ? WHERE id = ?`,
            [rating, text, id]
        );
    }

    static deleteById(id) {
        return db.execute("DELETE FROM reviewStore WHERE id = ?", [id]);
    }
}

module.exports = ReviewStore;
