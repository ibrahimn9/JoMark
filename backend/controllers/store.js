const ApiError = require("../utils/ApiError.js");
const asyncHandler = require("express-async-handler");
const Store = require('../model/store.model.js');
const SCA = require("../model/store_category_association.model.js");

const editStore = asyncHandler(async (req,res,next)=>{
    if (!req.isSeller){
        return next(
            new ApiError("You are not allowed to access this route ", 403)
        );
    }
    const {name, picture, slogan,address,start,end,categories,longitude,latitude} = await req.body
    console.log(req.body)
    const {storeId} = req.params
    await Store.updateStore(storeId,
        name ||  null,
        picture || null,
        slogan || null,
        address || null,
        start || null,
        end || null,
        longitude ||null,
        latitude || null
    );
    await SCA.deleteByIdStore(storeId);
    if (categories?.length) {
        for (let category of categories) {
            const categorySeller = new SCA(storeId, category);
            await categorySeller.save();
        }
    }
    res.status(200).json({
        success: true,
        message: 'Store updated successfully',
    });
})
module.exports={
    editStore
}