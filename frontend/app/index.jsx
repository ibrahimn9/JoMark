import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect } from "react";
import { CustomButton, SelectLangDropDown } from "@/components";
import images from "@/constants/images";
import { router, Redirect } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useGlobalContext } from "@/context/GlobalProvider";
import { useAuthContext } from "@/context/AuthProvider";
import dictionary from "@/constants/dictionary.json";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";

const Welcome = () => {
  const {
    selectedLang,
    setSelectedLang,
    userData,
    setUserData,
    setIsBottomSheetOpened,
  } = useGlobalContext();
  const selectedDict = dictionary.welcomeScreen[selectedLang];

  const { userToken, flag, setFlag, setUserToken } = useAuthContext();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load selectedLang from AsyncStorage when component mounts
    const loadSelectedLang = async () => {
      try {
        const storedLang = await AsyncStorage.getItem("selectedLang");
        if (storedLang) {
          setSelectedLang(storedLang);
        }
      } catch (error) {
        Alert.alert("Error loading selectedLang from AsyncStorage:", error);
      }
    };

    loadSelectedLang();
  }, []);

  useEffect(() => {
    const isLoggedIn = async () => {
      try {
        let currToken = await SecureStore.getItemAsync("userToken");
        if (currToken) {
          setUserToken(currToken);
          let currUser = await SecureStore.getItemAsync("userData");
          setUserData(JSON.parse(currUser));
        } else {
          let currFlag = await SecureStore.getItemAsync("flag");
          if (currFlag) setFlag(currFlag);
        }
      } catch (error) {
        Alert.alert("Something went wrong:", error);
      } finally {
        setIsLoading(false);
      }
    };

    isLoggedIn();
  }, []);

  useEffect(() => {
    setIsBottomSheetOpened(false);
  }, []);

  if (isLoading) {
    return (
      <SafeAreaView className="h-full">
        <View className="flex justify-center items-center h-full">
          <ActivityIndicator size="large" color="#fd7014" />
        </View>
      </SafeAreaView>
    );
  }

  if (userToken) {
    if (userData.isSeller) {
      return <Redirect href="/seller/home" />;
    } else {
      return <Redirect href="/buyer/home" />;
    }
  }

  if (flag === "unregisteredBuyer") {
    return <Redirect href="/buyer/home" />;
  }

  return (
    <SafeAreaView className="h-full">
      <ScrollView
        contentContainerStyle={{
          height: "100%",
        }}
      >
        <View className="relative w-full bg-highlight-lightest flex justify-between items-center h-full px-4 py-10">
          <SelectLangDropDown />
          <View>
            <Image
              source={images.logoErase}
              className="w-[300px] h-[200px]"
              resizeMode="contain"
            />
            <View className="relative mt-5">
              <Text className="text-3xl text-primary font-pblack text-center mb-2">
                {selectedDict.welcomeTitle}
              </Text>
              <Text className="text-xl text-accent font-pbold text-center">
                {selectedDict.welcomeSubTitle1}
                {"\n"}
                {selectedDict.welcomeSubTitle2}{" "}
                <Text className="text-secondary-light font-psemibold">
                  Jomark
                </Text>
              </Text>
              <Image
                source={images.path}
                className="w-[136px] h-[15px] absolute -bottom-2 -right-8"
                resizeMode="contain"
              />
            </View>
            <Text className="text-sm font-pregular text-black mt-5 text-center">
              {selectedDict.welcomeDesc}
            </Text>
          </View>
          <View className="w-full">
            <CustomButton
              title={selectedDict.getStartedBtn}
              handlePress={() => router.push("seller-buyer")}
              containerStyles="w-full mt-8 text-white"
              textStyles="text-white"
            />
            <CustomButton
              title={selectedDict.loginBtn}
              handlePress={() => router.push("/sign-in")}
              containerStyles="w-full mt-3 text-white bg-white border-[2px] border-accent"
              textStyles="text-accent"
            />
          </View>
        </View>
      </ScrollView>
      <StatusBar style="dark" />
    </SafeAreaView>
  );
};

export default Welcome;
