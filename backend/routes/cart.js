const express = require("express");
const {addProductToCart,deleteProductFromCart,editQuantity}= require("../controllers/cart");
const router = express.Router();
const {protect} = require('../controllers/auth')

/**-----------------------------------------------
 * @desc    add product to cart
 * @route   /api/cart
 * @method  POST
 * @access  Buyer
------------------------------------------------*/
router.post('/',protect,addProductToCart);
/**-----------------------------------------------
 * @desc    remove product from cart
 * @route   /api/cart/:productId
 * @method  DELETE
 * @access  Buyer
------------------------------------------------*/
router.delete('/:productId',protect,deleteProductFromCart);
/**-----------------------------------------------
 * @desc    update productQuantity in cart
 * @route   /api/cart/:productId
 * @method  PUT
 * @access  Buyer
------------------------------------------------*/
router.put('/:productId',protect,editQuantity);

module.exports = router;