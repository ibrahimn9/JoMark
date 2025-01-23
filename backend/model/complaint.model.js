const db = require("../config/database");
class Complaint {
    constructor(complaintText, orderId) {
        this.complaintText = complaintText;
        this.orderId = orderId;
    }

    async save() {
        const [result]= await db.execute(
            'INSERT INTO complaints (complaintText, orderId) VALUES (?, ?)',
            [this.complaintText, this.orderId]
        );
        return result.insertId;
    }

    static findById(id) {
        return db.execute('SELECT * FROM complaints WHERE id = ?', [id]);
    }

    static findAll() {
        return db.execute('SELECT * FROM complaints');
    }

    static findByOrderId(orderId) {
        return db.execute('SELECT * FROM complaints WHERE orderId = ?', [orderId]);
    }

    static deleteById(id) {
        return db.execute('DELETE FROM complaints WHERE id = ?', [id]);
    }

    static verifyComplaint(userId,orderId){
        return db.execute('SELECT COUNT(*) AS complaintExists FROM complaints c JOIN orders o ON c.orderId = o.id WHERE c.orderId = ? AND o.buyerId = ?',[orderId,userId]);
    }

    static updateResolveStatus(status,id){
        return db.execute(`UPDATE complaints SET resolved = ${status} WHERE id=${id} `);
    }
}

module.exports = Complaint;

