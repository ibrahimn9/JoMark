const db = require("../config/database");

class Product {
  constructor(
    name,
    description,
    price,
    quantity,
    tags,
    minQuantity,
    special,
    storeId,
    categoryId
  ) {
    this.name = name;
    this.description = description;
    this.price = price;
    this.quantity = quantity;
    this.tags = tags;
    this.minQuantity = minQuantity;
    this.special = special;
    this.storeId = storeId;
    this.categoryId = categoryId;
  }

  async save() {
    const [result] = await db.execute(
      `INSERT INTO products (name, description, price, quantity, tags, minQuantity, special, storeId, categoryId) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        this.name,
        this.description,
        this.price,
        this.quantity,
        this.tags,
        this.minQuantity,
        this.special,
        this.storeId,
        this.categoryId,
      ]
    );
    return result.insertId;
  }

  static fetchAll() {
    return db.execute("SELECT * FROM products");
  }

  static findById(id) {
    return db.execute(
      "SELECT p.id , p.name , p.description, p.price,p.likesCount, p.quantity, p.tags, p.minQuantity, p.dateCreation, p.special, s.id AS storeId,s.name AS storeName, c.id AS categoryId ,c.name AS categoryName FROM products p JOIN stores s ON p.storeId = s.id JOIN categories c ON p.categoryId = c.id JOIN sellers se ON s.sellerId = se.id WHERE p.id = ?",
      [id]
    );
  }

  static findByStoreId(storeId) {
    return db.execute("SELECT * FROM products WHERE storeId = ?", [storeId]);
  }

  static findBySellerId(sellerId) {
    return db.execute(
      "SELECT p.id , p.name , p.description, p.price, p.quantity, p.tags, p.minQuantity, p.dateCreation, p.special, s.id AS storeId,s.name AS storeName, c.id AS categoryId ,c.name AS categoryName FROM products p JOIN stores s ON p.storeId = s.id JOIN categories c ON p.categoryId = c.id JOIN sellers se ON s.sellerId = se.id WHERE se.id = ?",
      [sellerId]
    );
  }

  static ReviewerExist(productId, buyerId) {
    return db.execute(
      "SELECT * from reviewProduct where ? in (SELECT r1.buyerId from reviewProduct r1 where r1.productId = ?)",
      [buyerId, productId]
    );
  }

  static async updateProduct(
    id,
    name,
    description,
    price,
    quantity,
    tags,
    minQuantity,
    special,
    storeId,
    categoryId
  ) {
    const [[currentProduct]] = await db.execute(
      "SELECT * FROM products WHERE id = ?",
      [id]
    );
    if (!currentProduct) {
      throw new Error("Product not found");
    }
    const updatedStoreId =
      (await storeId) !== null ? storeId : currentProduct.storeId;
    const updatedCategoryId =
      (await categoryId) !== null ? categoryId : currentProduct.categoryId;
    const updatedspecial =
      (await special) !== null ? special : currentProduct.special;
    return db.execute(
      `UPDATE products SET name = ?, description = ?, price = ?, quantity = ?, tags = ?, minQuantity = ?, special = ?, storeId = ?, categoryId = ? WHERE id = ?`,
      [
        name,
        description,
        price,
        quantity,
        tags,
        minQuantity,
        special,
        updatedStoreId,
        updatedCategoryId,
        id,
      ]
    );
  }

  static deleteById(id) {
    return db.execute("DELETE FROM products WHERE id = ?", [id]);
  }

  static findForLastWeek(page, limit) {
    const offset = (page - 1) * limit;
    return db.execute(
      `SELECT p.*
            FROM products p
            WHERE p.dateCreation >= DATE_SUB(NOW(), INTERVAL 1 WEEK) LIMIT ${limit} OFFSET ${offset}`
    );
  }

  static fetchPaginated(page, limit) {
    const offset = (page - 1) * limit;
    return db.execute(`SELECT * FROM products LIMIT ${limit} OFFSET ${offset}`);
  }

  static findByCategoryId(id, page, limit) {
    const offset = (page - 1) * limit;
    return db.execute(
      `SELECT * FROM products where categoryId = ${id} LIMIT ${limit} OFFSET ${offset}`
    );
  }

  static findForSearch(exp, page, limit) {
    const offset = (page - 1) * limit;
    return db.execute(
      `SELECT * FROM products where SOUNDEX(name)=SOUNDEX('${exp}') OR name LIKE '%${exp}%' LIMIT ${limit} OFFSET ${offset}`
    );
  }

  static findSuggestion(word) {
    return db.execute(
      `SELECT id, name, FindMatchingWord('${word}', name) AS MatchingWord FROM products WHERE FindMatchingWord('${word}', name) IS NOT NULL`
    );
  }
}

module.exports = Product;
