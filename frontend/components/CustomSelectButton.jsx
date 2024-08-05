import { View, Text, TouchableWithoutFeedback, Image } from "react-native";
import React from "react";
import { MaterialIcons } from "@expo/vector-icons";

const CustomSelectButton = ({
  icon,
  title,
  handlePress,
  containerStyles,
  titleStyles,
  isSelected,
}) => {
  return (
    <TouchableWithoutFeedback onPress={handlePress}>
      <View
        className={`w-full rounded-lg  min-h-[62px] flex flex-row px-4 py-4 justify-between items-center bg-gray-lightest ${containerStyles}`}
      >
        <Image source={{ uri: icon }} className="w-6 h-6" />
        <View className="w-[70%]">
          <Text className={`text-[16px] text-black font-pmedium ${titleStyles}`}>
            {title}
          </Text>
        </View>
        {isSelected ? (
          <MaterialIcons name="check-box" size={24} color="#253444" />
        ) : (
          <MaterialIcons
            name="check-box-outline-blank"
            size={24}
            color="#D5D5D5"
          />
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

export default CustomSelectButton;
