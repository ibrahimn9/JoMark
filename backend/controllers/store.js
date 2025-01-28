const ApiError = require("../utils/ApiError.js");
const asyncHandler = require("express-async-handler");
const Store = require('../model/store.model.js');
const SCA = require("../model/store_category_association.model.js");
const Category = require('../model/categories.model.js')
const ReviewStore = require('../model/reviewStore.model.js');

const editStore = asyncHandler(async (req,res,next)=>{
    if (!req.isSeller){
        return next(
            new ApiError("You are not allowed to access this route ", 403)
        );
    }
    const {name, picture, slogan,address,start,end,categories,longitude,latitude} = await req.body
    const {storeId} = await req.params
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
        const categoryData = categories.map((categoryId) => ({
            storeId,
            categoryId,
        }));
        await SCA.saveMany(categoryData);
    }
    res.status(200).json({
        success: true,
        message: 'Store updated successfully',
    });
});

const getAllStores = asyncHandler(async (req,res,next) => {
    const [stores] = await Store.fetchAll();
    if (stores?.length) {
        for (let store of stores) {
            const [categories] = await Category.findByStoreId(store.id);
            store.categories =  await categories.map((cat) => cat.id);;
            store.rating = await ReviewStore.rateAVG(store.id);
        }
    }
    res.status(200).json({
        success: true,
        data:stores,
    });
})

module.exports={
    editStore,
    getAllStores
}