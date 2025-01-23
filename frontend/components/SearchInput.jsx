import { useEffect, useState } from "react";
import { View, TextInput, TouchableOpacity, Alert } from "react-native";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import productService from "../services/product";

const SearchInput = ({
  value,
  placeholder,
  handleChangeText,
  inputStyles,
  textInputStyle,
  handleSearch,
  handleClearSearch,
  ...props
}) => {



  return (
    <View
      className={`h-10 px-4 rounded-full bg-gray-200 flex flex-row items-center ${inputStyles}`}
    >
      {value.length === 0 && (
        <Feather name="search" size={22} color="#25344475" />
      )}

      {/* Text Input */}
      <TextInput
        className={`flex-1 ml-3 text-dark font-psemibold text-md mt-[3px] ${textInputStyle}`}
        value={value}
        placeholder={placeholder || "Search..."}
        placeholderTextColor="gray"
        onChangeText={handleChangeText}
        onSubmitEditing={handleSearch} // Trigger search on submit
        returnKeyType="search" //
        {...props}
      />

      {/* Clear Icon */}
      {value.length > 0 && (
        <TouchableOpacity onPress={handleClearSearch}>
          <MaterialCommunityIcons
            name="close-circle"
            size={24}
            color="#496686"
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default SearchInput;
