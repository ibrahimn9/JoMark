const db = require("../config/database");

class likeProduct {
    constructor(buyerId, productId) {
        this.buyerId = buyerId;
        this.productId = productId;
    }

    async save() {
        return db.execute(
            `INSERT INTO likeProduct (buyerId, productId) VALUES (?, ?)`,
            [this.buyerId, this.productId]
        );
    }

    static fetchAll() {
        return db.execute("SELECT * FROM likeProduct");
    }

    static findById(id) {
        return db.execute("SELECT * FROM likeProduct WHERE id = ?", [id]);
    }

    static findByBuyerIdAndProductId(buyerId,productId){
        return db.execute("SELECT * FROM likeProduct WHERE buyerId=? and productId=?",[buyerId,productId])
    }

    static updateLikeProduct(id,value){
        return db.execute('update likeProduct set `like`=? where id=?',[value,id]);
    }

    

    static deleteById(id) {
        return db.execute("DELETE FROM likeProduct WHERE id = ?", [id]);
    }

}

module.exports = likeProduct;