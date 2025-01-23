const express = require("express");
const {createOrder,getOneOrder,updateStatus,getOrdersOfSeller,addComplaint,updateStatusOfComplaint,getOrdersForBuyer}= require("../controllers/order");
const router = express.Router();
const {protect} = require('../controllers/auth')

/**-----------------------------------------------
 * @desc    create new order
 * @route   /api/order
 * @method  POST
 * @access  Buyer
------------------------------------------------*/
router.post('/',protect,createOrder);
/**-----------------------------------------------
 * @desc    get order by id
 * @route   /api/order/:orderId
 * @method  GET
 * @access  Buyer and Seller
------------------------------------------------*/
router.get('/track/:orderId',protect,getOneOrder);
/**-----------------------------------------------
 * @desc    update status of order
 * @route   /api/order/:orderId/status
 * @method  PUT
 * @access  Seller
------------------------------------------------*/
router.put('/:orderId/status',protect,updateStatus);
/**-----------------------------------------------
 * @desc    get orders for seller
 * @route   /api/order/seller
 * @method  GET
 * @access  Seller
------------------------------------------------*/
router.get('/seller',protect,getOrdersOfSeller);
/**-----------------------------------------------
 * @desc    add complaint for order
 * @route   /api/order/:orderId/complaint
 * @method  POST
 * @access  Buyer
------------------------------------------------*/
router.post('/:orderId/complaint',protect,addComplaint);
/**-----------------------------------------------
 * @desc    update complaint for order
 * @route   /api/order/:orderId/complaint
 * @method  PUT
 * @access  Buyer
------------------------------------------------*/
router.put('/:complaintId/complaint',protect,updateStatusOfComplaint);
/**-----------------------------------------------
 * @desc    get orders for seller of specefic buyer
 * @route   /api/order/:buyerId/history
 * @method  GET
 * @access  Seller
------------------------------------------------*/
router.get('/:buyerId/history',protect,getOrdersForBuyer);

module.exports = router;