const express = require("express");
const {
  getProduct,
  deleteProduct,
  editProduct,
  getProductsForBuyer,
  getProductsForLastWeek,
  getProductsByStore,
  getProductsByCategory,
  getProductsForSearch,
  getSuggestion,
  likeForProduct,
  updateActiveStatus
} = require("../controllers/product");

const {
  addReviewForProduct,
  updateReviewForProduct,
  deleteReviewForProduct,
  getReviewForProduct,
} = require("../controllers/review");
const router = express.Router();
const { protect } = require("../controllers/auth");

/**-----------------------------------------------
 * @desc    get product
 * @route   /product/:productId
 * @method  GET
 * @access  public
------------------------------------------------*/
router.get("/:productId",protect, getProduct);

/**-----------------------------------------------
 * @desc    delete product
 * @route   /product/:productId
 * @method  DELETE
 * @access  seller
------------------------------------------------*/
router.delete("/:productId", protect, deleteProduct);

/**-----------------------------------------------
 * @desc    delete product
 * @route   /product/:productId
 * @method  PUT
 * @access  seller
------------------------------------------------*/
router.put("/:productId", protect, editProduct);

/**-----------------------------------------------
 * @desc    add new review
 * @route   /product/:productId/review
 * @method  POST
 * @access  buyer
------------------------------------------------*/
router.post("/:productId/review", protect, addReviewForProduct);

/**-----------------------------------------------
 * @desc    get reviews
 * @route   /product/:productId/review
 * @method  GET
 * @access  public
------------------------------------------------*/
router.get("/:productId/review", getReviewForProduct);

/**-----------------------------------------------
 * @desc    delete review
 * @route   /product/:reviewId/review
 * @method  DELETE
 * @access  buyer
------------------------------------------------*/
router.delete("/:reviewId/review", protect, deleteReviewForProduct);

/**-----------------------------------------------
 * @desc    update review
 * @route   /product/:reviewId/review
 * @method  PUT
 * @access  buyer
------------------------------------------------*/
router.put("/:reviewId/review", protect, updateReviewForProduct);

/**-----------------------------------------------
 * @desc    get products
 * @route   /product/product/products
 * @method  GET
 * @access  public
------------------------------------------------*/
router.get("/product/products", getProductsForBuyer);

/**-----------------------------------------------
 * @desc    get products that was created last week
 * @route   /product/product/lastWeek
 * @method  GET
 * @access  public
------------------------------------------------*/
router.get("/product/lastWeek", getProductsForLastWeek);

/**-----------------------------------------------
 * @desc    get store products
 * @route   /product/product/store/:storeId
 * @method  GET
 * @access  public
------------------------------------------------*/
router.get("/product/store/:storeId", getProductsByStore);

/**-----------------------------------------------
 * @desc    get  products by categories
 * @route   /product/category/:categoryId
 * @method  GET
 * @access  public
------------------------------------------------*/
router.get("/product/category/:categoryId", getProductsByCategory);

/**-----------------------------------------------
 * @desc    get  products by search
 * @route   /product/product/search
 * @method  GET
 * @access  public
------------------------------------------------*/
router.get("/product/search/:expression", getProductsForSearch);

/**-----------------------------------------------
 * @desc    get  products by search
 * @route   /product/product/suggest
 * @method  GET
 * @access  public
------------------------------------------------*/
router.get("/product/suggest/:word", getSuggestion);

/**-----------------------------------------------
 * @desc    like product
 * @route   /product/like/:productId
 * @method  PUT
 * @access  buyer
------------------------------------------------*/
router.put("/like/:productId", protect, likeForProduct);

/**-----------------------------------------------
 * @desc    update product status (active/inactive)
 * @route   /product/:productId/status
 * @method  PUT
 * @access  seller

------------------------------------------------*/
router.put("/:productId/status",protect,updateActiveStatus);

module.exports = router;
