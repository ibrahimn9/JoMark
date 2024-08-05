const db = require("../config/database");
const config = require("../utils/config");

class Category_Store{
    constructor(storeId,categoryId){
        this.storeId = storeId;
        this.categoryId = categoryId;
    }
    async save() {
        return db.execute(
            `INSERT INTO store_category_association (storeId,categoryId) VALUES (?, ?)`,
            [this.storeId, this.categoryId]
        );
    }
    
    static fetchAll() {
        return db.execute("SELECT * FROM store_category_association");
    }
    
    static findByIdStore(id) {
        return db.execute("SELECT * FROM store_category_association WHERE storeId = ?", [id]);
    }
    static deleteByIdStore(id){
        return db.execute("DELETE FROM store_category_association WHERE storeId= ?",[id]);
    }
    static findByIdCategory(id) {
        return db.execute("SELECT * FROM store_category_association WHERE categoryId = ?", [id]);
    }
}

module.exports = Category_Store;