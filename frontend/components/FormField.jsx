import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import { useGlobalContext } from "@/context/GlobalProvider";

import icons from "@/constants/icons";

import { MaterialIcons } from '@expo/vector-icons';

const FormField = ({
  title,
  value,
  placeholder,
  handleChangeText,
  otherStyles,
  inputStyles,
  labelStyle,
  required,
  error,
  handleTextSecure,
  label,
  optional,
  drop,
  textInputStyle,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const { selectedLang } = useGlobalContext();

  return (
    <View className={`space-y-2 ${otherStyles}`}>
      <Text
        className={`text-base text-secondary-light font-pmedium ${labelStyle}`}
      >
        {title}{" "}
        {required && <Text className="text-red-500 text-[18px]">*</Text>}
      </Text>

      <View
        className={`w-full h-16 px-4  rounded-2xl border-2 border-dark-light focus:border-secondary flex flex-row items-center ${inputStyles}`}
      >
        <TextInput
          className={`flex-1 text-dark font-psemibold text-base ${textInputStyle}`}
          value={value}
          placeholder={placeholder}
          placeholderTextColor="#7e90a4"
          onChangeText={handleChangeText}
          keyboardType={title === "Phone Number" ? "phone-pad" : "default"}
          secureTextEntry={handleTextSecure && !showPassword}
          style={selectedLang === "AR" && { textAlign: "right" }}
          {...props}
        />

        {handleTextSecure && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Image
              source={!showPassword ? icons.visible : icons.hide}
              className="w-6 h-6"
              resizeMode="contain"
            />
          </TouchableOpacity>
        )}
        {label && (
          <Text className="text-accent font-pmedium ml-2">{label}</Text> 
        )}
        {drop && (
          <MaterialIcons name="keyboard-arrow-down" size={24} color="#496686" />
        )}
      </View>
      {error ? <Text className="text-red-500">{error}</Text> : null}
      {optional ? <Text className="text-accent-light ml-1 font-pregular">Optional</Text> : null}
    </View>
  );
};

export default FormField;
