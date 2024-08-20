import axios from "axios";

const baseUrl = "http://192.168.1.7:4000/api/product";

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

export default {
  editProduct,
  deleteProduct,
  getNewArrivals,
  getProductsForBuyer,
  getProductById,
  getProductByStore,
};
