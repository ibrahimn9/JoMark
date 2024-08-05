import { View, Text, Image } from "react-native";
import images from "../constants/images";
import { useGlobalContext } from "@/context/GlobalProvider";
import { CustomButton } from "@/components";
import React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SelectLangAlert = () => {
  const { selectedLang, setSelectedLang, langClicked, setLangClicked } =
    useGlobalContext();

  const saveSelectedLang = async (lang) => {
    try {
      await AsyncStorage.setItem("selectedLang", lang);
      setSelectedLang(lang);
    } catch (error) {
      console.error("Error saving selectedLang to AsyncStorage:", error);
    }
  };

  if (!langClicked)
    return (
      <View className="fixed top-0 left-0 w-full h-full bg-gray-400 bg-opacity-50 flex items-center justify-center z-[100]">
        <View className="bg-white rounded-lg w-[80%] flex items-center px-4 pb-8 shadow-md shadow-black">
          <Image
            source={images.logoBlank}
            className="w-[200px] h-[100px]"
            resizeMode="contain"
          />
          <Text className="text-secondary-light font-pbold text-lg">
            Welcome-Bienvenue-مرحبا
          </Text>
          <Text className="text-lg font-pregular text-center mt-4">
            اختر لغتك المفضلة للمتابعة
          </Text>
          <Text className="text-base font-pregular text-center mt-2">
            Choose your preferred language to continue
          </Text>
          <Text className="text-base font-pregular text-center mt-2">
            Choisissez votre langue préférée pour continuer
          </Text>
          <View className="mt-8 w-full px-6">
            <CustomButton
              title="عربية"
              handlePress={() => {
                saveSelectedLang("AR")
                setSelectedLang("AR");
                setLangClicked(true);
              }}
              containerStyles="w-full text-white min-h-[40px]"
              textStyles="text-white"
            />
            <CustomButton
              title="English"
              handlePress={() => {
                saveSelectedLang("EN")
                setSelectedLang("EN");
                setLangClicked(true);
              }}
              containerStyles="w-full mt-2 text-white min-h-[40px]"
              textStyles="text-white font-pmedium"
            />
            <CustomButton
              title="Français"
              handlePress={() => {
                saveSelectedLang("FR")
                setSelectedLang("FR");
                setLangClicked(true);
              }}
              containerStyles="w-full mt-2 text-white min-h-[40px]"
              textStyles="text-white font-pmedium"
            />
          </View>
        </View>
      </View>
    );
};

export default SelectLangAlert;
