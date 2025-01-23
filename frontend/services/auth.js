import axios from "axios";

const baseUrl = "http://192.168.1.38:4000/api/auth";

const signUp = async (body) => {
  return await axios.post(`${baseUrl}/signup`, body);
};

const login = async (body) => {
  return await axios.post(`${baseUrl}/login`, body);
};

const sendEmail = async (body) => {
  return await axios.post(`${baseUrl}/sendEmail/forgotPw`, body);
};

const verifyCode = async(body) => {
  return await axios.post(`${baseUrl}/confirmation`, body)
}

const setNewPassword = async(body) => {
  return await axios.put(`${baseUrl}/changePassword`, body)
}

export default {
  signUp,
  login,
  sendEmail,
  verifyCode,
  setNewPassword
};
