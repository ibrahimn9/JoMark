const express = require("express");
const {addReviewForStore,deleteReviewForStore,updateReviewForStore,getReviewForStore}= require("../controllers/review");
const {editStore,getAllStores} = require('../controllers/store');
const {getProductsByStore} = require('../controllers/product')
const router = express.Router();
const {protect} = require('../controllers/auth');

/**-----------------------------------------------
 * @desc    add new review
 * @route   /store/:storeId/review
 * @method  POST
 * @access  buyer
------------------------------------------------*/
router.post('/:storeId/review',protect,addReviewForStore);

/**-----------------------------------------------
 * @desc    get reviews
 * @route   /store/:storeId/review
 * @method  GET
 * @access  public
------------------------------------------------*/
router.get('/:storeId/review',getReviewForStore);


/**-----------------------------------------------
 * @desc    delete review
 * @route   /store/:reviewId
 * @method  DELETE
 * @access  buyer
------------------------------------------------*/
router.delete('/:reviewId',protect,deleteReviewForStore);

/**-----------------------------------------------
 * @desc    update review
 * @route   /store/:reviewId
 * @method  PUT
 * @access  buyer
------------------------------------------------*/
router.put('/:reviewId',protect,updateReviewForStore);

/**-----------------------------------------------
 * @desc    update store
 * @route   /store/:storeId/store
 * @method  PUT
 * @access  seller
------------------------------------------------*/
router.put('/:storeId/store',protect,editStore);

/**-----------------------------------------------
 * @desc    get store
 * @route   /store/stores
 * @method  GET
 * @access  ALL
------------------------------------------------*/
router.get('/stores',getAllStores);


/**-----------------------------------------------
 * @desc    get products by store
 * @route   /store/:storeId/products
 * @method  GET
 * @access  ALL
------------------------------------------------*/
router.get('/:storeId/products',getProductsByStore)


module.exports = router;