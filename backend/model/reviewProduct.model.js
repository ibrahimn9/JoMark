const db = require("../config/database");

class ReviewProduct {
    constructor(rating, text, productId, buyerId) {
        this.rating = rating;
        this.text = text;
        this.productId = productId;
        this.buyerId = buyerId;
    }

    async save() {
        return db.execute(
            `INSERT INTO reviewProduct (rating, text, productId, buyerId) VALUES (?, ?, ?, ?)`,
            [this.rating, this.text, this.productId, this.buyerId]
        );
    }

    static fetchAll() {
        return db.execute("SELECT * FROM reviewProduct");
    }

    static findByProductId(productId) {
        return db.execute("SELECT * FROM reviewProduct WHERE productId = ?", [productId]);
    }

    static findByBuyerId(buyerId) {
        return db.execute("SELECT * FROM reviewProduct WHERE buyerId = ?", [buyerId]);
    }

    static updateReview(id, rating, text) {
        return db.execute(
            `UPDATE reviewProduct SET rating = ?, text = ? WHERE id = ?`,
            [rating, text, id]
        );
    }

    static ReviewerExist(productId,buyerId){
        return db.execute("SELECT * from reviewProduct where ? in (SELECT r1.buyerId from reviewProduct r1 where r1.productId = ?)",[buyerId,productId])
    }
    static async rateAVG(productId) {
        const [rows] = await db.execute("SELECT avg(rating) as averageRating FROM reviewProduct WHERE productId = ?", [productId]);
        if (rows.length > 0) {
            return rows[0].averageRating;
        } else {
            return null; // Or handle it as you wish if there's no rating
        }
    }

    static deleteById(id) {
        return db.execute("DELETE FROM reviewProduct WHERE id = ?", [id]);
    }
}

module.exports = ReviewProduct;
