import axios from "axios";

const baseUrl = "http://192.168.1.6:4000/api/store";

const editStore = async (storeId, userToken, body) => {
  return await axios.put(`${baseUrl}/${storeId}/store`, body, {
    headers: {
      Authorization: `Bearer ${userToken}`,
    },
  });
};

export default {
    editStore
}
