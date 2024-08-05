import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Dimensions,
  Alert,
  Image,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import images from "../../constants/images";
import { CustomButton, FormField } from "../../components";
import { Link, router } from "expo-router";
import auth from "../../services/auth";
import { useAuthContext } from "@/context/AuthProvider";
import { useGlobalContext } from "@/context/GlobalProvider";

const SignIn = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  // To handle loading
  const [isSubmitting, setSubmitting] = useState(false);

  const { setUserData } = useGlobalContext();
  const { handleToken, handleUserData } = useAuthContext();

  const submit = async () => {
    setSubmitting(true);

    try {
      const res = await auth.login(form);
      await handleUserData(res.data.data);
      await handleToken(res.data.token);
      if (res.data.data.isSeller) {
        router.replace("/seller/home");
      } else {
        router.replace("/buyer/home");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "An unexpected error occurred";
      Alert.alert("Error", errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="bg-[#F5F5F5] h-full">
      <ScrollView>
        <View
          className="w-full flex justify-center items-center h-full px-4 my-2"
          style={{
            minHeight: Dimensions.get("window").height - 100,
          }}
        >
          <Image
            source={images.logoErase}
            className="w-[300px] h-[200px]"
            resizeMode="contain"
          />

          <Text className="text-2xl font-semibold text-primary mt-[-15px] font-pbold">
            Log in to Jomark
          </Text>

          <FormField
            title="Email"
            value={form.email}
            handleChangeText={(e) => setForm({ ...form, email: e })}
            inputStyles="border-gray-400"
            labelStyle="text-dark ml-1"
            otherStyles="mt-12"
            keyboardType="email-address"
          />

          <FormField
            title="Password"
            value={form.password}
            handleChangeText={(e) => setForm({ ...form, password: e })}
            inputStyles="border-gray-400"
            labelStyle="text-dark ml-1"
            otherStyles="mt-7"
            handleTextSecure={true}
          />

          <TouchableOpacity
            onPress={() => {
              router.push("/forgot-password");
            }}
            className="mt-4"
          >
            <View className="w-full flex flex-row justify-end">
              <Text className="text-secondary text-sm font-pregular text-right mr-2">
                Forgot Password?
              </Text>
            </View>
          </TouchableOpacity>

          <CustomButton
            title="Sign In"
            handlePress={submit}
            containerStyles="mt-7 w-full min-h-[52px]"
            textStyles="text-white"
            isLoading={isSubmitting}
          />

          <View className="flex justify-center pt-5 flex-row gap-2">
            <Text className="text-lg text-dark font-pregular">
              Don't have an account?
            </Text>
            <Link
              href="/seller-buyer"
              className="text-lg font-psemibold text-secondary"
            >
              Signup
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignIn;
