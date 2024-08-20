import { View, Text, StyleSheet } from "react-native";
import RNPickerSelect from "react-native-picker-select";
import React from "react";

const CustomSelectDropDown = ({
  title,
  data,
  containerStyles,
  placeholder,
  handleOnValueChange,
  labelStyle,
}) => {
  return (
    <View className={`${containerStyles}`}>
      <Text
        className={`text-base text-secondary-light font-pmedium mb-2 ${labelStyle}`}
      >
        {title}{" "}
      </Text>
      <RNPickerSelect
        onValueChange={handleOnValueChange}
        items={data}
        placeholder={{ label: placeholder, value: null }}
        style={customPickerStyles}
      />
    </View>
  );
};

export default CustomSelectDropDown;

const customPickerStyles = StyleSheet.create({
  inputIOS: {
    backgroundColor: "white",
  },
  inputAndroid: {
    backgroundColor: "#F5F5F5",
  },
});
