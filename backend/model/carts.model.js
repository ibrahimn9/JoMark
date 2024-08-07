const db = require("../config/database");

class Cart {
    constructor(buyerId, productId, quantity) {
        this.buyerId = buyerId;
        this.productId = productId;
        this.quantity = quantity;
    }

    async save() {
        const [existingCart] = await db.execute(
            `SELECT * FROM carts WHERE buyerId = ? AND productId = ?`,
            [this.buyerId, this.productId]
        );

        if (existingCart?.length > 0) {
            return { message: 'This product already exists in the cart' };
        } else {
            await db.execute(
                `INSERT INTO carts (buyerId, productId, quantity) VALUES (?, ?, ?)`,
                [this.buyerId, this.productId, this.quantity]
            );
            return { message: 'Product added to cart successfully' };
        }
    }

    static fetchAll() {
        return db.execute("SELECT * FROM carts");
    }

    static findByBuyerId(buyerId) {
        return db.execute("SELECT * FROM carts WHERE buyerId = ?", [buyerId]);
    }

    static findByProductId(productId) {
        return db.execute("SELECT * FROM carts WHERE productId = ?", [productId]);
    }

    static findByBuyerIdAndProductId(buyerId, productId) {
        return db.execute(
            "SELECT * FROM carts WHERE buyerId = ? AND productId = ?",
            [buyerId, productId]
        );
    }

    static updateQuantity(buyerId, productId, quantity) {
        return db.execute(
            "UPDATE carts SET quantity = ? WHERE buyerId = ? AND productId = ?",
            [quantity, buyerId, productId]
        );
    }

    static deleteByBuyerIdAndProductId(buyerId, productId) {
        return db.execute(
            "DELETE FROM carts WHERE buyerId = ? AND productId = ?",
            [buyerId, productId]
        );
    }

    static deleteByProductId( productId) {
        return db.execute(
            "DELETE FROM carts WHERE productId = ?",
            [productId]
        );
    }
}

module.exports = Cart;
