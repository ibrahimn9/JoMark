const ApiError = require("../utils/ApiError.js");
const asyncHandler = require("express-async-handler");
const Seller = require("../model/seller.model.js");
const Cart = require("../model/carts.model.js");
const Order = require('../model/orders.model.js');
const Document = require('../model/document.model.js');
const Product = require('../model/product.model.js');
const Complaint = require('../model/complaint.model.js');
const config = require("../utils/config.js");

const createOrder = asyncHandler(async(req,res,next) => {
    if (req.isSeller) {
        return next(new ApiError("You are not allowed to access this route ", 403));
    }
    const {productId, quantity, paymentMethod, shippingAddress} = await req.body;
    const order = new Order(productId,req.userId,quantity,paymentMethod,shippingAddress);
    const id = await order.save();
    order.id = await id; 
    await Cart.deleteByBuyerIdAndProductId(req.userId,productId);
    res.status(201).json({
        success: true,
        message: order
    });
})

const getOneOrder = asyncHandler(async(req,res,next) => {
    const {orderId} = req.params;
    const [[order]] = await Order.findById(orderId);
    const [[complaints]] = await Complaint.findByOrderId(orderId);
    order.complaint = await {...complaints};
    const [[product]] = await Product.findById(order.productId);
    const [documents] = await Document.findByProductId(order.productId);
    const imageUrl =(await documents?.length) > 0 ? await documents[0].link : null;
    product.imageUrl = await imageUrl;
    order.product = await {...product};
    delete order.productId;
    res.status(200).json({
        success: true,
        message: order
    });
})

const updateStatus = asyncHandler(async(req,res,next)=> {
    if (!req.isSeller) {
        return next(new ApiError("You are not allowed to access this route ", 403));
    }
    const {status} = await req.body;
    const {orderId} = req.params;
    await Order.updateStatus(orderId,status);
    res.status(200).json({
        success: true,
        message: "Updated order status."
    });
})

const getOrdersOfSeller = asyncHandler(async(req,res,next)=> {
    if (!req.isSeller) {
        return next(new ApiError("You are not allowed to access this route ", 403));
    }
    const [orders] =await Order.findOrdersOfSeller(req.userId);
    for(const order of orders){
        const [[product]] = await Product.findById(order.productId);
        const [documents] = await Document.findByProductId(order.productId);
        const imageUrl =(await documents?.length) > 0 ? await documents[0].link : null;
        product.imageUrl = await imageUrl;
        order.product = await {...product};
        delete order.productId;
    }
    res.status(200).json({
        success: true,
        message: orders
    });
});

const addComplaint = asyncHandler(async(req,res,next) =>{
    if (req.isSeller) {
        return next(new ApiError("You are not allowed to access this route ", 403));
    }
    const {orderId} = req.params;
    const {complaintText} = await req.body;
    const [[{result}]] =await Complaint.verifyComplaint(req.userId,orderId);
    if(result !==0){
        return next(new ApiError("You have already filed a complaint for this order", 400));
    }
    const complaint = new Complaint(complaintText,orderId);
    const id = await complaint.save();
    complaint.id = await id;
    res.status(200).json({
        success: true,
        message: complaint
    });

})

const updateStatusOfComplaint = asyncHandler(async(req,res,next) =>{
    if (req.isSeller) {
        return next(new ApiError("You are not allowed to access this route ", 403));
    }
    const {complaintId} = req.params;
    const {status} = await req.body;
    await Complaint.updateResolveStatus(status,complaintId);
    res.status(200).json({
        success: true,
        message: "complaint updated successfully"
    });
})

const getOrdersForBuyer=asyncHandler(async(req,res,next) => {
    if (req.isSeller) {
        return next(new ApiError("You are not allowed to access this route ", 403));
    }
    const {buyerId} = req.params
    const [orders] =await Order.findOrdersForBuyer(req.userId,buyerId);
    for(const order of orders){
        const [[product]] = await Product.findById(order.productId);
        const [documents] = await Document.findByProductId(order.productId);
        const imageUrl =(await documents?.length) > 0 ? await documents[0].link : null;
        product.imageUrl = await imageUrl;
        order.product = await {...product};
        delete order.productId;
    }
    res.status(200).json({
        success: true,
        message: orders
    });
})



module.exports ={
    createOrder,
    getOneOrder,
    updateStatus,
    getOrdersOfSeller,
    addComplaint,
    updateStatusOfComplaint,
    getOrdersForBuyer
}