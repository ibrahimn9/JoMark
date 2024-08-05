import React, { useState, useRef } from "react";
import { View, TextInput, SafeAreaView, Text, Alert } from "react-native";
import { CustomButton, FormField, VerfiedAlert } from "@/components";
import { router } from "expo-router";
import { useGlobalContext } from "@/context/GlobalProvider";
import auth from "../../../services/auth";

const ResetPassword = () => {
  const [error, setError] = useState(null);
  const [confirmError, setConfirmError] = useState(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showVerifiedAlert, setShowVerifiedAlert] = useState(false)

  const scrollViewRef = useRef(null);

  const validatePassword = (password) => {
    return password.length >= 8;
  };

  const handleValidate = () => {
    let valid = true;
    if (!validatePassword(password)) {
      setError("Password must be at least 8 characters long");
      valid = false;
    }
    if (password !== confirmPassword) {
      setConfirmError("Passwords do not match");
      valid = false;
    }
    return valid;
  };

  const { resetEmail } = useGlobalContext();
  const [isLoading, setIsLoading] = useState(false);

  const submit = async () => {
    if (handleValidate()) {
      setIsLoading(true);
      try {
        const res = await auth.setNewPassword({
          email: resetEmail,
          newPassword: password,
        });
      } catch (error) {
        const errorMessage =
          error.response?.data?.message || "An unexpected error occurred";
        Alert.alert("Error", errorMessage);
      } finally {
        setIsLoading(false);
        setShowVerifiedAlert(true)
      }
    }
  };

  return (
    <SafeAreaView className="relative h-full">
      <View className="w-full bg-[#f5f5f5] flex items-center h-full px-4 py-8">
        <Text className="text-dark text-2xl font-pbold text-center">
          Create a New Password
        </Text>
        <FormField
          title="Password"
          value={password}
          placeholder="Enter a new password"
          handleChangeText={(e) => setPassword(e)}
          otherStyles="mt-10"
          inputStyles={`${error ? "border-red-500" : ""}`}
          handleTextSecure={true}
          error={error}
        />
        <FormField
          title="Confirm Password"
          value={confirmPassword}
          placeholder="Confirm password"
          handleChangeText={(e) => setConfirmPassword(e)}
          otherStyles="mt-5"
          inputStyles={`${confirmError ? "border-red-500" : ""}`}
          handleTextSecure={true}
          error={confirmError}
        />
        <CustomButton
          title="Reset password"
          handlePress={submit}
          containerStyles="mt-10 w-full min-h-[48px] "
          textStyles="text-white"
          isLoading={isLoading}
        />
      </View>
      {showVerifiedAlert && <VerfiedAlert />}
    </SafeAreaView>
  );
};

export default ResetPassword;
