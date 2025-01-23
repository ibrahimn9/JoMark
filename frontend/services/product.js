import axios from "axios";

const baseUrl = "http://192.168.1.38:4000/api/product";

const editProduct = async (body, productId, userToken) => {
  return await axios.put(`${baseUrl}/${productId}`, body, {
    headers: {
      Authorization: `Bearer ${userToken}`,
    },
  });
};

const deleteProduct = async (productId, userToken) => {
  return await axios.delete(`${baseUrl}/${productId}`, {
    headers: {
      Authorization: `Bearer ${userToken}`,
    },
  });
};

const getNewArrivals = async () => {
  return await axios.get(`${baseUrl}/product/lastWeek`);
};

const getProductsForBuyer = async () => {
  return await axios.get(`${baseUrl}/product/products`);
};

const getProductById = async (productId) => {
  return await axios.get(`${baseUrl}/${productId}`);
};

const getProductByStore = async (storeId) => {
  return await axios.get(`${baseUrl}/product/store/${storeId}`);
};

const getProductByCategory = async (categoryId) => {
  return await axios.get(`${baseUrl}/product/category/${categoryId}`);
};

const getProductBySearch = async (expression) => {
  return await axios.get(`${baseUrl}/product/search/${expression}`);
};

const getSuggestion = async (word) => {
  return await axios.get(`${baseUrl}/product/suggest/${word}`);
};

export default {
  editProduct,
  deleteProduct,
  getNewArrivals,
  getProductsForBuyer,
  getProductById,
  getProductByStore,
  getProductByCategory,
  getProductBySearch,
  getSuggestion,
};
