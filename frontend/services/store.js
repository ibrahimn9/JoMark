import axios from "axios";

const baseUrl = "http://192.168.1.38:4000/api/store";

const editStore = async (storeId, userToken, body) => {
  return await axios.put(`${baseUrl}/${storeId}/store`, body, {
    headers: {
      Authorization: `Bearer ${userToken}`,
    },
  });
};

const getStores = async () => {
  return await axios.get(`${baseUrl}/stores`);
};

export default {
  editStore,
  getStores
};
