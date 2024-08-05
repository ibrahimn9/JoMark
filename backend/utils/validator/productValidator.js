const { body, check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validator");
const db = require("../../config/database");

exports.validateAddProduct =[
    body('storeId')
    .custom(async (storeId, { req }) => {
        const [[storeResult]] = await db.execute('SELECT * FROM stores WHERE id = ?', [storeId]);
        if (!storeResult) {
            throw new Error('store must be exist');
        }
        return true;
    }),
    body('categoryId')
    .custom(async (categoryId, { req }) => {
        const [[categoryResult]] = await db.execute('SELECT * FROM categories WHERE id = ?', [categoryId]);
        if (!categoryResult) {
            throw new Error('category must be exist');
        }
        return true;
    }),
    validatorMiddleware
]


