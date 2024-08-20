import axios from "axios";

const baseUrl = "http://192.168.1.7:4000/api/seller";

const createProduct = async (body, sellerId, userToken) => {
  return await axios.post(`${baseUrl}/${sellerId}/product`, body, {
    headers: {
      Authorization: `Bearer ${userToken}`,
    },
  });
};

const getProducts = async (sellerId, userToken) => {
  return await axios.get(`${baseUrl}/${sellerId}/products`, {
    headers: {
      Authorization: `Bearer ${userToken}`,
    },
  });
};

export default {
  createProduct,
  getProducts
};
