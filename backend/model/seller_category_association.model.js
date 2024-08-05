const db = require("../config/database");
const config = require("../utils/config");

class Category_Seller{
    constructor(sellerId,categoryId){
        this.sellerId = sellerId;
        this.categoryId = categoryId;
    }
    async save() {
        return db.execute(
            `INSERT INTO seller_category_association (sellerId,categoryId) VALUES (?, ?)`,
            [this.sellerId, this.categoryId]
        );
    }
    
    static fetchAll() {
        return db.execute("SELECT * FROM seller_category_association");
    }
    
    static findByIdSeller(id) {
        return db.execute("SELECT * FROM seller_category_association WHERE sellerId = ?", [id]);
    }
    
    static findByIdCategory(id) {
        return db.execute("SELECT * FROM seller_category_association WHERE categoryId = ?", [id]);
    }
}

module.exports = Category_Seller;