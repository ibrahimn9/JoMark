const db = require("../config/database");

class Document {
    constructor(link, productId) {
        this.link = link;
        this.productId = productId;
    }

    async save() {
        return db.execute(
            `INSERT INTO documents (link, productId) VALUES (?, ?)`,
            [this.link, this.productId]
        );
    }

    static fetchAll() {
        return db.execute("SELECT * FROM documents");
    }

    static findById(id) {
        return db.execute("SELECT * FROM documents WHERE id = ?", [id]);
    }

    static findByProductId(productId) {
        return db.execute("SELECT * FROM documents WHERE productId = ?", [productId]);
    }

    static deleteById(id) {
        return db.execute("DELETE FROM documents WHERE id = ?", [id]);
    }

    static deleteByProductId(id){
        return db.execute("DELETE FROM documents WHERE productId = ?", [id]);
    }
}

module.exports = Document;
