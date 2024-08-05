const ApiError = require("../utils/ApiError.js");
const asyncHandler = require("express-async-handler");
const Seller = require("../model/seller.model.js");
const Buyer = require("../model/buyer.model.js");
const Store_category = require("../model/store_category_association.model.js");
const Store = require("../model/store.model.js");
const Document = require("../model/document.model.js");
const Product = require("../model/product.model.js");
const config = require("../utils/config.js");

const addProduct = asyncHandler(async (req, res, next) => {
  if (!req.isSeller) {
    return next(new ApiError("You are not allowed to access this route ", 403));
  }
  const {
    name,
    description,
    price,
    quantity,
    tags,
    minQuantity,
    special,
    storeId,
    categoryId,
    documents,
  } = await req.body;
  const product = new Product(
    name || null,
    description || null,
    price || null,
    quantity || null,
    tags || null,
    minQuantity || null,
    special || false,
    storeId,
    categoryId
  );
  const productId = await product.save();
  if (documents?.length) {
    for (const documentLink of documents) {
      const document = new Document(documentLink, productId);
      await document.save();
    }
  }
  res.status(201).json({
    success: true,
    message: "Product added successfully",
  });
});

const getProducts = asyncHandler(async (req, res, next) => {
  const { sellerId } = req.params;
  const [products] = await Product.findBySellerId(sellerId);

  const productsWithImages = await Promise.all(
    products.map(async (product) => {
      const [documents] = await Document.findByProductId(product.id);
      const imageUrl =
        documents.length > 0 ? JSON.parse(documents[0].link).link : null;
      return {
        ...product,
        imageUrl,
      };
    })
  );

  res.status(200).json({
    success: true,
    data: productsWithImages,
  });
});

const getProduct = asyncHandler(async (req, res, next) => {
  const { productId } = req.params;
  const [[product]] = await Product.findById(productId);
  const [documents] = await Document.findByProductId(product.id);
  product.media = [...documents];
  res.status(200).json({
    success: true,
    data: product,
  });
});

const deleteProduct = asyncHandler(async (req, res, next) => {
  if (!req.isSeller) {
    return next(new ApiError("You are not allowed to access this route ", 403));
  }
  const { productId } = req.params;
  await Product.deleteById(productId);
  res.status(200).json({
    success: true,
    message: "product deleted successfully",
  });
});

const editProduct = asyncHandler(async (req, res, next) => {
  if (!req.isSeller) {
    return next(new ApiError("You are not allowed to access this route ", 403));
  }
  const { productId } = req.params;
  const {
    name,
    description,
    price,
    quantity,
    tags,
    minQuantity,
    special,
    storeId,
    categoryId,
    documents,
  } = await req.body;
  await Product.updateProduct(
    productId,
    name || null,
    description || null,
    price || null,
    quantity || null,
    tags || null,
    minQuantity || null,
    special !== undefined ? special : null,
    storeId || null,
    categoryId || null
  );
  await Document.deleteByProductId(productId);
  if (documents?.length) {
    for (const documentLink of documents) {
      const document = new Document(documentLink, productId);
      await document.save();
    }
  }
  res.status(200).json({
    success: true,
    message: "product edited successfully",
  });
});

module.exports = {
  addProduct,
  getProducts,
  getProduct,
  deleteProduct,
  editProduct,
};
