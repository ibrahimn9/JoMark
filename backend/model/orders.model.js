const db = require('../config/database');

class Order {
    constructor(productId, buyerId, quantity, paymentMethod, shippingAddress) {
        this.productId = productId;
        this.buyerId = buyerId;
        this.quantity = quantity;
        this.paymentMethod = paymentMethod;
        this.shippingAddress = shippingAddress;
        this.status = "in transit";
    }

    async save() {
        const [result] = await db.execute(
            `INSERT INTO orders (productId, buyerId, quantity, paymentMethod, shippingAddress,status) 
             VALUES (?, ?, ?, ?, ?, ?)`,
            [
                this.productId,
                this.buyerId,
                this.quantity,
                this.paymentMethod,
                this.shippingAddress,
                this.status
            ]
        );
        return result.insertId; 
    }


    static fetchAll() {
        return db.execute('SELECT * FROM orders');
    }

    
    static findById(id) {
        return db.execute('SELECT * FROM orders WHERE id = ?', [id]);
    }

    
    static findByBuyerId(buyerId) {
        return db.execute('SELECT * FROM orders WHERE buyerId = ?', [buyerId]);
    }

    
    static updateStatus(id, status) {
        return db.execute('UPDATE orders SET status = ? WHERE id = ?', [status, id]);
    }

    
    static deleteById(id) {
        return db.execute('DELETE FROM orders WHERE id = ?', [id]);
    }

    static findOrdersOfSeller(sellerId){
        return db.execute('SELECT o.* FROM orders o where o.productId IN (SELECT p.id FROM products p WHERE p.storeId IN(SELECT s.id FROM stores s where s.sellerId=?))',[sellerId])
    }

    static findOrdersForBuyer(buyerId){
        return db.execute('SELECT o.* FROM orders o where o.buyerId =? ',[buyerId])
    }
}

module.exports = Order;
