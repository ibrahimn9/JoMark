import { View, Text, TouchableOpacity } from "react-native";
import React, { useEffect } from "react";
import VerfiedFill from "@/constants/svg/VerifiedFill";
import { AntDesign } from "@expo/vector-icons";
import { router } from "expo-router";


const VerfiedAlert = () => {
  return (
    <View className="absolute top-0 left-0 w-full h-full bg-gray-300 bg-opacity-50 flex items-center justify-center z-[100]">
      <View className="bg-white rounded-3xl w-[80%] flex justify-center items-center p-8 shadow-md shadow-black">
        <VerfiedFill />
        <Text className="text-dark font-pbold text-2xl text-center mt-4">
          Congratulations !
        </Text>
        <Text className="text-dark text-lg text-center font-pregular mt-2">
          Your password has been successfully updated
        </Text>
        <TouchableOpacity className="flex flex-row items-center mt-4" onPress={() => router.replace("sign-in")}>
          <Text className="text-primary font-pmedium text-lg">
            Go to Login
          </Text>
          <AntDesign
            name="arrowright"
            size={24}
            color="#374d65"
            style={{ marginLeft: 10 }}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default VerfiedAlert;
