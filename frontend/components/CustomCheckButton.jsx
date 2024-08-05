import { View, Text, TouchableWithoutFeedback, Image } from "react-native";
import React from "react";
import { MaterialIcons } from "@expo/vector-icons";



const CustomCheckButton = ({
  icon,
  title,
  text,
  handlePress,
  containerStyles,
  titleStyles,
  textStyles,
  isSelected,
}) => {
  return (
    <TouchableWithoutFeedback onPress={handlePress}>
      <View
        className={`w-full rounded-lg  min-h-[62px] flex flex-row px-4 py-4 justify-between items-center bg-gray-lightest ${containerStyles}`}
      >
        <Image source={icon} className="w-8 h-8" />
        <View className="w-[70%]">
          <Text className={`text-lg text-black font-psemibold ${titleStyles}`}>
            {title}
          </Text>
          <Text
            className={`text-sm text-dark-lightest font-pregular ${textStyles}`}
          >
            {text}
          </Text>
        </View>
        {isSelected ? (
          <MaterialIcons
            name="radio-button-checked"
            size={24}
            color="black"
          />
        ) : (
          <MaterialIcons
            name="radio-button-unchecked"
            size={24}
            color="#D5D5D5"
          />
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

export default CustomCheckButton;
