import { View, Text, TouchableOpacity } from "react-native";
import { useGlobalContext } from "@/context/GlobalProvider";
import { Entypo } from "@expo/vector-icons";
import React, { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SelectLangDropDown = () => {
  const [isLangOpened, setIsLangOpened] = useState(false);
  const { selectedLang, setSelectedLang, langClicked, setLangClicked } =
    useGlobalContext();
  const langs = ["FR", "EN", "AR"];

  const saveSelectedLang = async (lang) => {
    try {
      await AsyncStorage.setItem("selectedLang", lang);
      setSelectedLang(lang);
    } catch (error) {
      console.error("Error saving selectedLang to AsyncStorage:", error);
    }
  };

  if (!isLangOpened)
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => {
          setLangClicked(true);
          setIsLangOpened(!isLangOpened);
        }}
        className="absolute right-[18px] top-[50px] border border-primary rounded-full flex flex-row gap-1 px-2 z-10"
      >
        <Text className="text-primary text-md font-pmedium">
          {selectedLang}
        </Text>
        <View>
          <Entypo name="chevron-down" size={22} color="#374d65" />
        </View>
      </TouchableOpacity>
    );
  else
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => setIsLangOpened(!isLangOpened)}
        className="absolute right-[18px] top-[50px] border border-primary rounded-2xl py-2 z-10"
      >
        <View className="flex flex-row gap-1 px-2 mb-1">
          <Text className="text-primary text-md font-pmedium">
            {selectedLang}
          </Text>
          <View>
            <Entypo name="chevron-up" size={22} color="#374d65" />
          </View>
        </View>
        {langs
          .filter((lang) => lang !== selectedLang)
          .map((lang, index) => (
            <View key={index} className="mx-2 py-1 border-t border-primary">
              <Text
                onPress={() => {
                  setSelectedLang(lang);
                  saveSelectedLang(lang);
                  setIsLangOpened(!isLangOpened);
                }}
                className="text-primary text-md font-pmedium"
              >
                {lang}
              </Text>
            </View>
          ))}
      </TouchableOpacity>
    );
};

export default SelectLangDropDown;
