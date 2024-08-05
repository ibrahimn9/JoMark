const { body, check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validator");
const db = require("../../config/database");
exports.validateUser = [
    // body('fullName')
    //     .isString()
    //     .isLength({ min: 3 })
    //     .withMessage('Full name must be at least 3 characters long')
    //     .custom(async (fullName, { req }) => {
    //         const [[buyerResult]] = await db.execute('SELECT * FROM buyers WHERE fullName = ?', [fullName]);
    //         const [[sellerResult]] = await db.execute('SELECT * FROM sellers WHERE fullName = ?', [fullName]);
    //         if (buyerResult || sellerResult) {
    //             throw new Error('Full name must be unique');
    //         }
    //         return true;
    //     }),
    body('email')
        .isEmail()
        .withMessage('Must be a valid email address')
        .custom(async (email) => {
            const [[buyerResult]] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
            if (buyerResult) {
                throw new Error('Email must be unique');
            }
            return true;
        }),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long'),
    // body('phoneNumber')
    //     .isLength({ min: 10, max: 10 })
    //     .withMessage('Phone number must be exactly 10 characters long')
    //     .matches(/^(05|06|07)/)
    //     .withMessage('Phone number must start with 05, 06, or 07'),
    // body('wilaya')
    //     .isString()
    //     .optional(),
    validatorMiddleware
];

exports.validateEmailAndFullname = [
    // body('fullName')
    //     .isString()
    //     .isLength({ min: 3 })
    //     .withMessage('Full name must be at least 3 characters long')
    //     .custom(async (fullName, { req }) => {
    //         const [[buyerResult]] = await db.execute('SELECT * FROM buyers WHERE fullName = ?', [fullName]);
    //         const [[sellerResult]] = await db.execute('SELECT * FROM sellers WHERE fullName = ?', [fullName]);
    //         if (buyerResult || sellerResult) {
    //             throw new Error('Full name must be unique');
    //         }
    //         return true;
    //     }),
    body('email')
        .isEmail()
        .withMessage('Must be a valid email address')
        .custom(async (email) => {
            const [[buyerResult]] = await db.execute('SELECT * FROM buyers WHERE email = ?', [email]);
            const [[sellerResult]] = await db.execute('SELECT * FROM sellers WHERE email = ?', [email]);
            if (buyerResult || sellerResult) {
                throw new Error('Email must be unique');
            }
            return true;})
]
