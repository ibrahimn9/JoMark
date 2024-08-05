const db = require("../config/database");

class Store {
    constructor(name, picture,slogan, sellerId,address,longitude,latitude) {
        this.name = name;
        this.picture = picture;
        this.slogan = slogan ;
        this.sellerId = sellerId;
        this.address = address
        this.longitude = longitude;
        this.latitude = latitude;
    }

    async save() {
        const [result] = await db.execute(
            `INSERT INTO stores (name, picture,slogan, sellerId,address,longitude,latitude) VALUES (?, ?, ? ,? ,? ,? ,?)`,
            [this.name, this.picture,this.slogan, this.sellerId,this.address,this.longitude,this.latitude]
        );
        return result.insertId;
    }

    static fetchAll() {
        return db.execute("SELECT * FROM stores");
    }

    static findById(id) {
        return db.execute("SELECT * FROM stores WHERE id = ?", [id]);
    }

    static findBySellerId(sellerId) {
        return db.execute("SELECT * FROM stores WHERE sellerId = ?", [sellerId]);
    }

    static updateStore(id,name, picture, slogan,address,start,end,longitude,latitude)  {
        return db.execute(
            `UPDATE stores SET name = ?, picture = ?, slogan = ?,address = ?,start = ?,end = ?, longitude=?, latitude=? WHERE id=? `,
            [name, picture,slogan,address,start,end,longitude,latitude,id]
        );
    }

    static deleteById(id) {
        return db.execute("DELETE FROM stores WHERE id = ?", [id]);
    }
}

module.exports = Store;
