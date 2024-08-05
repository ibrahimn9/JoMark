import { View, Text, SafeAreaView, ScrollView, Alert } from "react-native";
import React, { useState } from "react";
import ForgotPWD from "../../../constants/svg/ForgotPWD";
import { CustomButton, FormField } from "@/components";
import { router } from "expo-router";
import { useGlobalContext } from "@/context/GlobalProvider";
import auth from "../../../services/auth";

const ForgotPassword = () => {
  const [email, setEmail] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const { setResetEmail } = useGlobalContext();

  const handleSendEmail = async () => {
    setIsLoading(true);
    setResetEmail(email);
    try {
      const res = await auth.sendEmail({ email });
      router.push("verify-code");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "An unexpected error occurred";
      Alert.alert("Error", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView>
      <View className="w-full flex justify-center items-center h-full px-4">
        <Text className="text-dark text-3xl font-pbold mb-4">
          Forgot Password ?
        </Text>
        <ForgotPWD width={250} height={274} />
        <Text className="mt-4 text-gray-500 font-pregular text-[15px]">
          No worries, we'll send you reset instructions
        </Text>
        <View className="mt-7 w-full px-6">
          <FormField
            title="Email"
            value={email}
            handleChangeText={(e) => setEmail(e)}
            inputStyles="h-[52px] border-gray-400"
            keyboardType="email-address"
            labelStyle="text-dark ml-1"
            placeholder="Enter your email"
          />
          <CustomButton
            title="Reset password"
            handlePress={handleSendEmail}
            containerStyles="mt-4 w-full min-h-[48px] "
            textStyles="text-white"
            disabled={!email}
            isLoading={isLoading}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ForgotPassword;
