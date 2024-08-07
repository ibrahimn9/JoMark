const ApiError = require("../utils/ApiError.js");
const asyncHandler = require("express-async-handler");
const Store = require('../model/store.model.js');
const SCA = require("../model/store_category_association.model.js");
const Category = require('../model/categories.model.js')
const ReviewStore = require('../model/reviewStore.model.js');
const Cart = require('../model/carts.model.js');


const addProductToCart = asyncHandler(async(req,res,next) =>{
    if (req.isSeller) {
        return next(new ApiError("You are not allowed to access this route ", 403));
    }
    const {productId,quantity} = await req.body;
    const cart = new Cart(req.userId,productId,quantity);
    const message = (await cart.save()).message;
    res.status(201).json({
        success: true,
        message: message
    });
})

const deleteProductFromCart = asyncHandler(async(req,res,next) =>{
    if (req.isSeller) {
        return next(new ApiError("You are not allowed to access this route ", 403));
    }
    const {productId} = await req.params;
    await Cart.deleteByProductId(productId);
    res.status(200).json({
        success: true,
        message: "Product removed from cart"
    });
})

const editQuantity = asyncHandler(async(req,res,next) => {
    if (req.isSeller) {
        return next(new ApiError("You are not allowed to access this route ", 403));
    }
    const {productId} = await req.params;
    const {quantity} = await req.body;
    await Cart.updateQuantity(req.userId,productId,quantity || null);
    res.status(200).json({
        success: true,
        message: "Product quantity updated"
    });
});

module.exports = {
    addProductToCart,
    deleteProductFromCart,
    editQuantity
}