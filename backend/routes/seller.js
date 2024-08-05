const express = require("express");
const {addProduct,getProducts}= require("../controllers/product");
const router = express.Router();
const {protect} = require('../controllers/auth')

/**-----------------------------------------------
 * @desc    add new product
 * @route   /seller/:sellerId/product
 * @method  POST
 * @access  seller
------------------------------------------------*/
router.post('/:sellerId/product',protect,addProduct)

/**-----------------------------------------------
 * @desc    get all product for seller
 * @route   /seller/:sellerId/products
 * @method  GET
 * @access  public
------------------------------------------------*/
router.get('/:sellerId/products',getProducts);

module.exports = router;