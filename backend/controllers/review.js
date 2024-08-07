const ApiError = require("../utils/ApiError.js");
const asyncHandler = require("express-async-handler");
const Seller = require("../model/seller.model.js");
const Buyer = require("../model/buyer.model.js");
const Store_category = require("../model/store_category_association.model.js");
const Store = require('../model/store.model.js');
const Document = require('../model/document.model.js')
const Product = require('../model/product.model.js');
const ReviewStore = require('../model/reviewStore.model.js');
const ReviewProduct = require('../model/reviewProduct.model.js');
const config = require("../utils/config.js");


const addReviewForStore = asyncHandler( async(req,res,next) => {
    if (req.isSeller){
        return next(
            new ApiError("You are not allowed to access this route ", 403)
        );
    }
    const {storeId} = await req.params;
    const {rating,text} = await req.body;
    const [result] = await ReviewStore.ReviewerExist(storeId,req.userId);
    if(result?.length !==0){
        return next(
            new ApiError("You are already add your review for store ", 403)
        );
    }
    const RS = new ReviewStore(rating,text,storeId,req.userId);
    await RS.save();
    res.status(201).json({
        success: true,
        message: 'Review added successfully',
    });

});

const deleteReviewForStore = asyncHandler( async(req,res,next) => {
    if (req.isSeller){
        return next(
            new ApiError("You are not allowed to access this route ", 403)
        );
    }
    const {reviewId} = await req.params;
    await ReviewStore.deleteById(reviewId);
    res.status(200).json({
        success: true,
        message: 'Review deleted successfully',
    });

})

const updateReviewForStore = asyncHandler( async(req,res,next) => {
    if (req.isSeller){
        return next(
            new ApiError("You are not allowed to access this route ", 403)
        );
    }
    const {reviewId} = await req.params;
    const {rating,text} = await req.body;
    await ReviewStore.updateReview(
        reviewId,
        rating || null,
        text || null
    );
    res.status(200).json({
        success: true,
        message: 'Review updated successfully',
    });

})

const getReviewForStore = asyncHandler(async(req,res,next)=>{
    const {storeId} = await req.params
    const [reviews] = await ReviewStore.findByStoreId(storeId);
    const [avg] = await ReviewStore.rateAVG(storeId);
    res.status(200).json({
        success: true,
        data: reviews,
        avg:avg
    });
});

const getReviewForProduct = asyncHandler(async(req,res,next)=>{
    const {productId} = await req.params
    const [reviews] = await ReviewProduct.findByProductId(productId);
    const avg = await ReviewProduct.rateAVG(productId);
    res.status(200).json({
        success: true,
        data: reviews,
        avg: avg
    });
});

const addReviewForProduct = asyncHandler( async(req,res,next) => {
    if (req.isSeller){
        return next(
            new ApiError("You are not allowed to access this route ", 403)
        );
    }
    const {productId} = await req.params;
    const {rating,text} = await req.body;
    const [result] = await ReviewProduct.ReviewerExist(productId,req.userId);
    if(result?.length !==0){
        return next(
            new ApiError("You are already add your review for product ", 403)
        );
    }
    const RS = new ReviewProduct(rating,text,productId,req.userId);
    await RS.save();
    res.status(201).json({
        success: true,
        message: 'Review added successfully',
    });
});

const deleteReviewForProduct = asyncHandler( async(req,res,next) => {
    if (req.isSeller){
        return next(
            new ApiError("You are not allowed to access this route ", 403)
        );
    }
    const {reviewId} = await req.params;
    await ReviewProduct.deleteById(reviewId);
    res.status(200).json({
        success: true,
        message: 'Review deleted successfully',
    });
});

const updateReviewForProduct = asyncHandler( async(req,res,next) => {
    if (req.isSeller){
        return next(
            new ApiError("You are not allowed to access this route ", 403)
        );
    }
    const {reviewId} = await req.params;
    const {rating,text} = await req.body;
    await ReviewProduct.updateReview(
        reviewId,
        rating || null,
        text || null
    );
    res.status(200).json({
        success: true,
        message: 'Review updated successfully',
    });
});

module.exports ={
    addReviewForStore,
    deleteReviewForStore,
    updateReviewForStore,
    addReviewForProduct,
    deleteReviewForProduct,
    updateReviewForProduct,
    getReviewForProduct,
    getReviewForStore
}