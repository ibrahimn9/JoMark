import axios from "axios";

const baseUrl = "http://192.168.1.6:4000/api/product";

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

export default {
  editProduct,
  deleteProduct,
};
