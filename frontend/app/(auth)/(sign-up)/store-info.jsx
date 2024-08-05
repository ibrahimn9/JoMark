import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import icons from "../../../constants/icons";
import {
  FormField,
  CustomButton,
  CustomSelectDropDown,
  SkipBtn,
  BusinessAddressInput,
} from "@/components";
import { useGlobalContext } from "@/context/GlobalProvider";
import { useAuthContext } from "@/context/AuthProvider";
import dictionary from "@/constants/dictionary.json";
import { router } from "expo-router";
import wilaya from "@/constants/wilaya";

import * as ImagePicker from "expo-image-picker";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../../firebaseConfig";
import auth from "@/services/auth";

const StoreInfo = () => {
  const { selectedLang, setSelectedLang, userData, setUserData } =
    useGlobalContext();
  const selectedDict = dictionary.storeInfoScreen[selectedLang];

  const [storeData, setStoreData] = useState({});
  const [storeImage, setStoreImage] = useState(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isSkipLoading, setIsSkipLoading] = useState(false);

  const handleSelectImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setStoreImage(result.assets[0]);
    }
  };

  const handleUploadImage = async () => {
    if (storeImage) {
      const storageRef = ref(storage, `store_images/${storeImage.fileName}`);
      const img = await fetch(storeImage.uri);
      const bytes = await img.blob();
      await uploadBytes(storageRef, bytes);
      const downloadURL = await getDownloadURL(storageRef);
      return downloadURL;
    }
    return null;
  };

  const { handleToken, handleUserData } = useAuthContext();

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const imageUrl = await handleUploadImage();
      console.log(imageUrl);
      const updatedStoreData = {
        ...storeData,
        storePic: imageUrl,
      };
      setUserData({ ...userData, ...updatedStoreData });
      const res = await auth.signUp({ ...userData, ...updatedStoreData });

      //login
      const loginBody = {
        email: userData.email,
        password: userData.password,
      };

      const loginRes = await auth.login(loginBody);

      await handleToken(loginRes.data.token);
      await handleUserData(loginRes.data.data);

      if (loginRes.data.data.isSeller) {
        router.replace("/seller/home");
      } else {
        router.replace("/buyer/home");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "An unexpected error occurred";
      Alert.alert("Error", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkipPress = async () => {
    setIsSkipLoading(true);
    try {
      setUserData(userData);
      const res = await auth.signUp(userData);

      //login
      const loginBody = {
        email: userData.email,
        password: userData.password,
      };

      const loginRes = await auth.login(loginBody);

      await handleToken(loginRes.data.token);
      await handleUserData(loginRes.data.data);

      if (loginRes.data.data.isSeller) {
        router.replace("/seller/home");
      } else {
        router.replace("/buyer/home");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "An unexpected error occurred";
      Alert.alert("Error", errorMessage);
    } finally {
      setIsSkipLoading(false);
    }
  };

  return (
    <SafeAreaView className="relative h-full bg-white">
      <ScrollView>
        <View className="w-full bg-[#fff] flex justify-between min-h-screen px-4 pt-[80px]">
          <View>
            <Text className="text-3xl text-dark font-pbold mb-2">
              {selectedDict.title}
            </Text>

            <View className="w-full flex items-center mt-3">
              <TouchableOpacity
                onPress={handleSelectImage}
                className="flex justify-center items-center h-[140px] w-[140px] border-[2px] border-dark-lighter rounded-full bg-gray-lighter"
              >
                {storeImage ? (
                  <Image
                    source={{ uri: storeImage.uri }}
                    className="w-full h-full rounded-full"
                    resizeMode="cover"
                  />
                ) : (
                  <Image
                    source={icons.uploadStorePic}
                    className="w-[65px] h-[65px]"
                    resizeMode="contain"
                  />
                )}
              </TouchableOpacity>
              <Text className="text-lg text-secondary-light font-pmedium mt-2">
                {selectedDict.storePicLabel}
              </Text>
            </View>
            <FormField
              title={selectedDict.storeNameLabel}
              value={storeData.storeName}
              placeholder={selectedDict.storeNamePlaceholder}
              handleChangeText={(e) =>
                setStoreData({ ...storeData, storeName: e })
              }
              otherStyles="mt-5"
            />
            <FormField
              title={selectedDict.storeSloganLabel}
              value={storeData.storeSlogan}
              placeholder={selectedDict.storeSloganPlaceholder}
              handleChangeText={(e) =>
                setStoreData({ ...storeData, storeSlogan: e })
              }
              otherStyles="mt-10"
            />
            <BusinessAddressInput
              storeData={storeData}
              editObj={storeData}
              setEditObj={setStoreData}
              otherStyles="mt-4 border-0 px-0"
            />
          </View>
          <View className="bottom-0 left-0 w-full bg-white min-h-[80px] flex justify-center items-center mt-4">
            <CustomButton
              title={selectedDict.submitBtn}
              containerStyles="w-full text-white min-h-[48px] rounded-full"
              textStyles="text-white"
              handlePress={handleSubmit}
              isLoading={isLoading}
            />
          </View>
        </View>
      </ScrollView>

      <SkipBtn
        next="/seller/home"
        method="replace"
        submitSkip={true}
        handlePress={handleSkipPress}
      />

      {isSkipLoading && (
        <View className="absolute h-full w-full flex justify-center items-center">
          <ActivityIndicator size="large" color="#fd7014" />
        </View>
      )}
    </SafeAreaView>
  );
};

export default StoreInfo;
