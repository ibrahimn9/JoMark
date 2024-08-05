import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Keyboard } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useGlobalContext } from "@/context/GlobalProvider";

const SearchBar = ({
  placeholder,
  value,
  handleChangeText,
  otherStyles,
  inputStyles,
  labelStyle,
  required,
  toggleSearch,
  handleSearchClick,
  error,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(true);

  const { selectedLang } = useGlobalContext();

  const handleKeyPress = ({ nativeEvent }) => {
    if (nativeEvent.key === 'Enter') {
      handleSearchClick();
      Keyboard.dismiss();  // to dismiss the keyboard on enter
    }
  };

  return (
    <View className={`space-y-2 ${otherStyles}`}>
      <View
        className={`w-full h-11 px-4 rounded-full bg-white border ${
          isFocused ? "border-secondary" : "border-accent"
        } flex flex-row items-center ${inputStyles}`}
      >
        <TextInput
          className="flex-1 text-dark font-psemibold text-[13px]"
          value={value}
          placeholder={placeholder}
          placeholderTextColor="#7e90a4"
          onChangeText={handleChangeText}
          onFocus={() => setIsFocused(true)}
          onBlur={() => {
            toggleSearch(false);
            setIsFocused(false);
          }}
          onKeyPress={handleKeyPress}
          autoFocus={true}
          style={selectedLang === "AR" && { textAlign: "right" }}
          {...props}
        />
        <TouchableOpacity onPress={handleSearchClick}>
          <MaterialCommunityIcons
            name={isFocused ? "archive-search" : "archive-search-outline"}
            size={24}
            color={isFocused ? "#fd7014" : "#496686"}
          />
        </TouchableOpacity>
      </View>
      {error ? <Text className="text-red-500">{error}</Text> : null}
    </View>
  );
};

export default SearchBar;
