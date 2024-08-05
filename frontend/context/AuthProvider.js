import React, { createContext, useContext, useEffect, useState } from "react";
import { asyncStorage } from "react-native";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useGlobalContext } from "@/context/GlobalProvider";

const AuthContext = createContext();
export const useAuthContext = () => useContext(AuthContext);

const AuthProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [userToken, setUserToken] = useState(null);
  const { setUserData } = useGlobalContext();
  const [flag, setFlag] = useState(null);

  const handleToken = async (token) => {
    setUserToken(token);
    await SecureStore.setItemAsync("userToken", token);
    setIsLoading(false);
  };

  const handleUserData = async (data) => {
    setUserData(data);
    await SecureStore.setItemAsync("userData", JSON.stringify(data));
    setIsLoading(false);
  };

  const handleFlag = async (flag) => {
    setFlag(flag);
    await SecureStore.setItemAsync("flag", flag);
    setIsLoading(false);
  };

  const logout = async () => {
    setUserToken(null);
    setUserData({
      fullName: null,
      email: null,
      password: null,
      phoneNumber: null,
      store: {},
      isSeller: null,
      categories: [],
    });
    setFlag(null);
    await SecureStore.deleteItemAsync("userToken");
    await SecureStore.deleteItemAsync("userData");
    await SecureStore.deleteItemAsync("flag");
    router.replace("/");
  };

  const removeFlag = async () => {
    setFlag(null);
    await SecureStore.deleteItemAsync("flag");
  };

  return (
    <AuthContext.Provider
      value={{
        handleToken,
        userToken,
        setUserToken,
        flag,
        setFlag,
        handleUserData,
        logout,
        handleFlag,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
