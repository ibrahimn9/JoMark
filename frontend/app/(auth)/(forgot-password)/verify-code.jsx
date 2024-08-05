import React, { useState } from "react";
import { View, TextInput, SafeAreaView, Text, Alert } from "react-native";
import { CustomButton } from "@/components";
import { router } from "expo-router";
import { useGlobalContext } from "@/context/GlobalProvider";
import auth from "../../../services/auth";

const CodeInput = () => {
  const [code, setCode] = useState(["", "", "", "", ""]);

  const handleChangeText = (text, index) => {
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);
    // Automatically focus the next input
    if (text && index < code.length - 1) {
      inputs[index + 1].focus();
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && code[index] === "") {
      if (index > 0) {
        inputs[index - 1].focus();
      }
    }
  };


  let inputs = [];

  const { resetEmail } = useGlobalContext();
  const [isLoading, setIsLoading] = useState(false);

  const handleResend = async () => {
    try {
      const res = await auth.sendEmail({ email: resetEmail });
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "An unexpected error occurred";
      Alert.alert("Error", errorMessage);
    }
  };

  const submitCode = async () => {
    setIsLoading(true);
    try {
      const res = await auth.verifyCode({
        code: code?.join(""),
        email: resetEmail,
      });
      router.push("reset-password")
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
      <View className="w-full bg-[#f5f5f5] flex justify-center items-center h-full px-4">
        <Text className="text-dark text-3xl font-pbold">Verify</Text>
        <Text className="mt-2 mb-7 text-gray-400 font-pregular text-[15px]">
          Please enter the code we sent you to email
        </Text>
        <View className="flex flex-row justify-between w-4/5 mx-auto mt-4">
          {code.map((_, index) => (
            <TextInput
              key={index}
              className="w-12 h-12 border-[2px] border-accent rounded-md text-center text-xl"
              value={code[index]}
              onChangeText={(text) => handleChangeText(text, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
              maxLength={1}
              keyboardType="numeric"
              ref={(input) => {
                inputs[index] = input;
              }}
            />
          ))}
        </View>
        <Text className="mt-12 text-gray-400 font-pregular text-[15px]">
          Didn't recieve the code ?
        </Text>
        <Text
          onPress={handleResend}
          className="mt-1 text-secondary font-pmedium text-[15px]"
        >
          Resend code
        </Text>
        <CustomButton
          title="Verify"
          handlePress={submitCode}
          containerStyles="mt-12 w-full min-h-[48px] "
          textStyles="text-white"
          disabled={!code.every((num) => num.length === 1)}
          isLoading={isLoading}
        />
      </View>
    </SafeAreaView>
  );
};

export default CodeInput;
