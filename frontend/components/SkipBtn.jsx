import { View, Text } from "react-native";
import React from "react";
import { router } from "expo-router";
import { useGlobalContext } from "@/context/GlobalProvider";
import { useAuthContext } from "@/context/AuthProvider";
import dictionary from "@/constants/dictionary.json";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SkipBtn = ({ next, method, lazy, submitSkip, handlePress }) => {
  const { selectedLang } = useGlobalContext();
  const selectedDict = dictionary.skipBtn[selectedLang];
  const { handleFlag } = useAuthContext();
  return (
    <Text
      onPress={async () => {
        if (lazy) await handleFlag("unregisteredBuyer");
        if (submitSkip) await handlePress();
        router[method](next);
      }}
      className={`absolute top-[45px] ${
        selectedLang === "AR" ? "left-[26px]" : "right-[20px]"
      } text-lg font-pmedium text-dark-light`}
    >
      {selectedDict}
    </Text>
  );
};

export default SkipBtn;
