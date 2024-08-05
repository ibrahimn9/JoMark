import { View, Text, Image } from "react-native";
import React from "react";
import images from "@/constants/images";

const Card = ({ image, cardTitle, cardText }) => {
  return (
    <View className="relative w-[300px] bg-white rounded-lg border border-gray-light m-4 overflow-hidden">
      <Image
        source={images[image]}
        className="w-full h-[270px]"
        resizeMode="cover"
      />
      <View className="px-4 py-2">
        <Text className="font-psemibold text-md text-primary">
          {cardTitle}
        </Text>
        <Text className="font-pregular text-dark-lighter text-xs">{cardText}</Text>
      </View>
    </View>
  );
};

export default Card;
