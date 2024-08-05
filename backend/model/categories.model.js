const db = require("../config/database");
const config = require("../utils/config");

class Category{
    constructor(name,icon){
        this.name = name;
        this.icon = icon;
    }
    async save() {
        return db.execute(
            `INSERT INTO categories (name,icon) VALUES (?, ?)`,
            [this.name, this.icon]
        );
    }
    
    static fetchAll() {
        return db.execute("SELECT * FROM categories");
    }
    
    static findById(id) {
        return db.execute("SELECT * FROM categories WHERE id = ?", [id]);
    }
    
    static findByName(name){
        return db.execute("SELECT * FROM categories WHERE name =?",[name]);
    }
    static findByStoreId(id){
        return db.execute("SELECT c.id FROM categories c join store_category_association sca on sca.categoryId=c.id WHERE sca.storeId = ?", [id]);
    }
}

module.exports = Category