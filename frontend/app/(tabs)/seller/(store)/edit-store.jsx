import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  ScrollView,
  SafeAreaView,
  TouchableWithoutFeedback,
  Alert,
} from "react-native";
import React, { useState, useRef } from "react";
import { useGlobalContext } from "@/context/GlobalProvider";
import icons from "@/constants/icons";
import categories from "@/constants/categories";
import BottomSheet, {
  BottomSheetView,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import {
  GestureHandlerRootView,
  PanGestureHandler,
} from "react-native-gesture-handler";
import * as ImagePicker from "expo-image-picker";
import {
  CustomButton,
  FormField,
  CustomSelectButton,
  BusinessAddressInput,
} from "@/components";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../../../firebaseConfig";
import BusinessHoursInput from "@/components/seller/BusinessHoursInput";
import store from "@/services/store";
import { useAuthContext } from "@/context/AuthProvider";
import { MaterialIcons } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";

const EditStore = () => {
  const { userData, setUserData } = useGlobalContext();
  const { userToken } = useAuthContext();

  const storeData = userData.store;

  const [editObj, setEditObj] = useState({});
  const [storeImage, setStoreImage] = useState(null);
  const [isEdited, setIsEdited] = useState(false); // Track if anything is edited

  const handleEditChange = (field, value) => {
    setEditObj((prevState) => ({ ...prevState, [field]: value }));
    setIsEdited(true); // Mark as edited
  };

  const handleSelectImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setStoreImage(result.assets[0]);
      setIsEdited(true); // Mark as edited
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

  const { isBottomSheetOpened, setIsBottomSheetOpened } = useGlobalContext();

  const bottomSheetRef = useRef(null);
  const [bottomSheetComp, setBottomSheetComp] = useState("");

  const initialSnapPoints =
    bottomSheetComp === "success-edit" ? [200, 200] : [500, 500, 900];
  const openBottomSheet = (comp) => {
    setIsBottomSheetOpened(true);
    setBottomSheetComp(comp);
    if (bottomSheetRef.current) {
      bottomSheetRef.current.snapToIndex(1);
    }
  };

  const closeBottomSheet = () => {
    setIsBottomSheetOpened(false);
    if (bottomSheetRef.current) {
      bottomSheetRef.current.close();
    }
  };

  // handle submit
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const imageUrl = await handleUploadImage(); // Upload image and get URL
      const storeDataToUpdate = {
        ...storeData,
        ...editObj,
        picture: imageUrl || storeData.picture, // Include image URL in the update data
      };

      const res = await store.editStore(
        storeData.id,
        userToken,
        storeDataToUpdate
      );
      setUserData({ ...userData, store: storeDataToUpdate });
      openBottomSheet("success-edit");
    } catch (error) {
      console.error("Error updating store:", error);
      Alert.alert("Error updating store:", error);
    } finally {
      setIsLoading(false);
    }
  };

  console.log(editObj);

  return (
    <GestureHandlerRootView>
      <SafeAreaView className="relative bg-white h-full">
        {isBottomSheetOpened && (
          <TouchableWithoutFeedback onPress={() => closeBottomSheet()}>
            <View
              className="absolute h-full w-full z-[10]"
              style={{ backgroundColor: "rgba(0, 0, 0, 0.4)" }}
            />
          </TouchableWithoutFeedback>
        )}
        <ScrollView
          contentContainerStyle={{ paddingBottom: 80 }}
          showsVerticalScrollIndicator={false}
        >
          <View className="border-t border-gray-lighter py-2 px-4 mt-[2px]">
            <View className="flex flex-row items-center justify-between">
              <Text className="font-pmedium text-lg text-dark-light">
                Store picture
              </Text>
              <Text
                onPress={handleSelectImage}
                className="font-pregular text-lg text-secondary"
              >
                {storeData?.picture ? "Edit" : "Add"}
              </Text>
            </View>
            <View className="w-full flex items-center my-2">
              <TouchableOpacity
                onPress={handleSelectImage}
                className="h-[98px] w-[98px] border border-dark rounded-full overflow-hidden"
              >
                {storeData.picture ? (
                  <Image
                    source={{ uri: storeImage?.uri || storeData.picture }}
                    className="w-full h-full"
                    resizeMode="cover"
                  />
                ) : (
                  <Image
                    source={storeImage?.uri || icons.uploadStorePic}
                    className="w-[98px] h-[98px] rounded-full"
                    resizeMode="cover"
                  />
                )}
              </TouchableOpacity>
            </View>
          </View>
          <View className="border-t border-gray-lighter py-2 px-4 mt-[2px]">
            <View className="flex flex-row items-center justify-between">
              <Text className="font-pmedium text-lg text-dark-light">
                Store name
              </Text>
              <Text
                onPress={() => handleEditChange("name", storeData.name || "")}
                className="font-pregular text-lg text-secondary"
              >
                {storeData?.name ? "Edit" : "Add"}
              </Text>
            </View>
            {Object.keys(editObj).find((k) => k === "name") ? (
              <TextInput
                value={editObj.name}
                placeholder="Enter your store name..."
                onChangeText={(value) => handleEditChange("name", value)}
                className="font-pmedium my-1"
                autoFocus={true}
              />
            ) : storeData?.name ? (
              <Text className="text-center text-primary-light font-pregular text-base">
                {storeData.name}
              </Text>
            ) : (
              <Text
                onPress={() => handleEditChange("name", "")}
                className="text-center font-pregular text-base text-dark-lightest"
              >
                Add your Store name...
              </Text>
            )}
          </View>
          <View className="border-t border-gray-lighter py-2 px-4 mt-[2px]">
            <View className="flex flex-row items-center justify-between">
              <Text className="font-pmedium text-lg text-dark-light">
                Slogan
              </Text>
              <Text
                onPress={() =>
                  handleEditChange("slogan", storeData.slogan || "")
                }
                className="font-pregular text-lg text-secondary"
              >
                {storeData?.slogan ? "Edit" : "Add"}
              </Text>
            </View>
            {Object.keys(editObj).find((k) => k === "slogan") ? (
              <TextInput
                value={editObj.slogan}
                placeholder="Enter your slogan..."
                onChangeText={(value) => handleEditChange("slogan", value)}
                className="font-pmedium my-1"
                autoFocus={true}
              />
            ) : storeData?.slogan ? (
              <Text className="text-center text-primary-light font-pregular text-base">
                {storeData.slogan}
              </Text>
            ) : (
              <Text
                onPress={() => handleEditChange("slogan", "")}
                className="text-center font-pregular text-base text-dark-lightest"
              >
                Add your Slogan...
              </Text>
            )}
          </View>
          <BusinessAddressInput
            editObj={editObj}
            setEditObj={(newEditObj) => {
              setEditObj(newEditObj);
              setIsEdited(true); // Mark as edited
            }}
            storeData={storeData}
          />
          <BusinessHoursInput
            editObj={editObj}
            setEditObj={(newEditObj) => {
              setEditObj(newEditObj);
              setIsEdited(true); // Mark as edited
            }}
            storeData={storeData}
          />
          <View className="border-t border-gray-lighter py-2 px-4 mt-[2px] flex-y-1">
            <View className="flex flex-row items-center justify-between">
              <Text className="font-pmedium text-lg text-dark-light">
                Category
              </Text>
              <Text
                onPress={() => {
                  setEditObj({
                    ...editObj,
                    categories: editObj.categories?.length
                      ? editObj.categories
                      : storeData.categories,
                  });
                  openBottomSheet("category");
                }}
                className="font-pregular text-lg text-secondary"
              >
                {storeData?.categories.length ? "Edit" : "Add"}
              </Text>
            </View>
            <View className="flex flex-row items-center justify-center flex-wrap gap-x-1 mt-2">
              {categories.data
                .filter(
                  (cat) =>
                    storeData.categories?.includes(cat.id) ||
                    editObj.categories?.includes(cat.id)
                )
                .map((cat, index) => (
                  <View
                    key={index}
                    className="border border-dark-light p-1 rounded-md bg-gray-lightest mt-2"
                  >
                    <Image
                      className="w-6 h-6"
                      source={{
                        uri: `${cat.icon.slice(0, -6)}435160`,
                      }}
                    />
                  </View>
                ))}
            </View>
          </View>
        </ScrollView>
        {isEdited && (
          <View className="absolute bottom-0 left-0 w-full bg-white h-[50px] z-[2] flex justify-center items-center p-4">
            <CustomButton
              title="Save"
              containerStyles="w-full text-white min-h-[38px] rounded-lg"
              textStyles="text-white"
              handlePress={handleSubmit}
              isLoading={isLoading}
            />
          </View>
        )}
        <BottomSheet
          ref={bottomSheetRef}
          index={-1}
          snapPoints={initialSnapPoints}
          enablePanDownToClose={true}
          onClose={() => closeBottomSheet()}
          containerStyle={{ zIndex: 1500 }}
        >
          {bottomSheetComp === "category" && (
            <View className="border-b-[1px] border-gray-lighter p-2 w-full">
              <Text className="font-pmedium text-lg text-center">
                Select Category
              </Text>
            </View>
          )}
          <BottomSheetScrollView showsVerticalScrollIndicator={false}>
            <View>
              {bottomSheetComp === "category" && (
                <View className="flex items-center w-full">
                  <ScrollView
                    className="px-2 mt-4"
                    showsVerticalScrollIndicator={false}
                    nestedScrollEnabled
                  >
                    {categories.data.map((cat, index) => (
                      <CustomSelectButton
                        key={index}
                        handlePress={() => {
                          let newCategories = editObj.categories?.concat(
                            cat.id
                          );
                          setEditObj({ ...editObj, categories: newCategories });
                          setIsEdited(true); // Mark as edited
                        }}
                        isSelected={editObj.categories?.includes(cat.id)}
                        title={cat.name}
                        icon={cat.icon}
                        containerStyles="mb-2"
                      />
                    ))}
                  </ScrollView>
                </View>
              )}
              {bottomSheetComp === "success-edit" && (
                <View className="items-center p-4">
                  <Ionicons
                    name="checkmark-done-circle-outline"
                    size={64}
                    color="#1DCC79"
                  />
                  <Text className="font-pmedium mt-2 px-12 text-center text-lg">
                    Store has been edited successfully
                  </Text>
                </View>
              )}
            </View>
          </BottomSheetScrollView>
        </BottomSheet>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default EditStore;
