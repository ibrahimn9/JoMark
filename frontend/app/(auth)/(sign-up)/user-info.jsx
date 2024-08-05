import { View, Text, ScrollView, SafeAreaView, Alert } from "react-native";
import React, { useState, useRef } from "react";
import { FormField, CustomButton, SkipBtn } from "@/components";
import { useGlobalContext } from "@/context/GlobalProvider";
import dictionary from "@/constants/dictionary.json";
import { router } from "expo-router";

const UserInformation = () => {
  const { selectedLang, setSelectedLang, userData, setUserData } =
    useGlobalContext();
  const selectedDict = dictionary.userInfoScreen[selectedLang];
  const scrollViewRef = useRef(null);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    phoneNumber: "",
  });

  // Inputs validations
  const [errors, setErrors] = useState({
    fullName: "",
    email: "",
    password: "",
    phoneNumber: "",
  });

  const validateFullName = (fullName) => {
    return fullName.length > 5;
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 8;
  };

  const validatePhoneNumber = (phoneNumber) => {
    const re = /^(07|06|05)\d{8}$/;
    return re.test(phoneNumber);
  };

  const handleValidate = () => {
    let valid = true;
    let newErrors = { fullName: "", email: "", password: "", phoneNumber: "" };

    if (!validateFullName(form.fullName)) {
      newErrors.fullName = selectedDict.fullnameError;
    }

    if (!validateEmail(form.email)) {
      newErrors.email = selectedDict.emailError;
      valid = false;
    }
    if (!validatePassword(form.password)) {
      newErrors.password = selectedDict.passwordError;
      valid = false;
    }
    if (form.phoneNumber && !validatePhoneNumber(form.phoneNumber)) {
      newErrors.phoneNumber = selectedDict.phoneNumberError;
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = () => {
    if (handleValidate()) {
      setUserData({ ...userData, ...form });
      router.push("store-info");
    } else {
      // Scroll to the bottom of the ScrollView when errors are set
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  };

  return (
    <SafeAreaView className="relative h-full bg-white">
      <ScrollView
        ref={scrollViewRef}
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <View className="w-full bg-[#fff] px-4 pt-[80px]">
          <Text className="text-3xl text-dark font-pbold">
            {selectedDict.title}
          </Text>
          <FormField
            title={selectedDict.fullnameLabel}
            value={form.fullName}
            placeholder={selectedDict.fullnamePlaceholder}
            handleChangeText={(e) => setForm({ ...form, fullName: e })}
            otherStyles="mt-10"
            inputStyles={`${errors.fullName ? "border-red-500" : ""}`}
            required={true}
            error={errors.fullName}
          />
          <FormField
            title={selectedDict.emailLabel}
            value={form.email}
            placeholder={selectedDict.emailPlaceholder}
            handleChangeText={(e) => setForm({ ...form, email: e })}
            otherStyles="mt-10"
            inputStyles={`${errors.email ? "border-red-500" : ""}`}
            required={true}
            error={errors.email}
            keyboardType="email-address"
          />
          <FormField
            title={selectedDict.passwordLabel}
            value={form.password}
            placeholder={selectedDict.passwordPlaceholder}
            handleChangeText={(e) => setForm({ ...form, password: e })}
            otherStyles="mt-10"
            inputStyles={`${errors.password ? "border-red-500" : ""}`}
            required={true}
            handleTextSecure={true}
            error={errors.password}
          />
          <FormField
            title={selectedDict.phoneNumberLabel}
            value={form.phoneNumber}
            placeholder={selectedDict.phoneNumberPlaceholder}
            handleChangeText={(e) => setForm({ ...form, phoneNumber: e })}
            otherStyles="mt-10"
            inputStyles={`${errors.phoneNumber ? "border-red-500" : ""}`}
            required={false}
            keyboardType="phone-pad"
            error={errors.phoneNumber}
          />
        </View>
      </ScrollView>
      <View className="absolute bottom-0 left-0 w-full bg-white min-h-[80px] flex justify-center items-center px-4">
        <CustomButton
          title={selectedDict.continueBtn}
          containerStyles="w-full text-white min-h-[48px] rounded-full"
          textStyles="text-white"
          handlePress={handleSubmit}
          disabled={!form.fullName || !form.email || !form.password}
        />
      </View>
    </SafeAreaView>
  );
};

export default UserInformation;



