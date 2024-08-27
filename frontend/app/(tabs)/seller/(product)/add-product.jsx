import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Image,
  Alert,
  Dimensions,
  FlatList,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import { useGlobalContext } from "@/context/GlobalProvider";
import { useAuthContext } from "@/context/AuthProvider";
import icons from "@/constants/icons";
import {
  Card,
  FormField,
  CustomSelectButton,
  CustomButton,
} from "@/components";
import BottomSheet, {
  BottomSheetView,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import {
  GestureHandlerRootView,
  PanGestureHandler,
} from "react-native-gesture-handler";
import useHorizontalSwipeHandler from "@/hooks/useHorizontalSwipeHandler";
import categories from "@/constants/categories";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../../../firebaseConfig";
import seller from "../../../../services/seller";

const NewProduct = () => {
  const { userData, showTabs, hideTabs, setRefreshProduct, refreshProduct } =
    useGlobalContext();
  const { userToken } = useAuthContext();
  const [media, setMedia] = useState([]);
  const [productProfile, setProductProfile] = useState(null);
  const screenWidth = Dimensions.get("window").width;

  const pickMedia = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsMultipleSelection: true,
      selectionLimit: 10 - media.length,
      quality: 1,
    });

    if (!result.canceled) {
      let selectedMedia = result.assets;

      // Filter out duplicates
      selectedMedia = selectedMedia.filter(
        (item) => !media.some((m) => m.uri === item.uri)
      );

      // Show alert if no new media was added
      if (selectedMedia.length === 0) {
        Alert.alert(
          "No new media selected or all selected media are duplicates."
        );
        return;
      }

      // Insert videos after the first image if media is not empty
      let updatedMedia = [...media, ...selectedMedia].slice(0, 10);

      // If there's a video in the beginning, swap it with the first image
      if (updatedMedia[0]?.type === "video" && updatedMedia.length > 1) {
        const firstImageIndex = updatedMedia.findIndex(
          (item) => item.type === "image"
        );
        if (firstImageIndex > 0) {
          [updatedMedia[0], updatedMedia[firstImageIndex]] = [
            updatedMedia[firstImageIndex],
            updatedMedia[0],
          ];
        }
      }

      // Update product profile image if it's null or update based on media changes
      if (updatedMedia.length > 0 && !productProfile) {
        setProductProfile(updatedMedia[0]);
      }

      setMedia(updatedMedia);
    }
  };

  const removeMedia = (index) => {
    const updatedMedia = media.filter((_, i) => i !== index);

    // Reset product profile if it was removed
    if (media[index].uri === productProfile?.uri) {
      setProductProfile(updatedMedia[0] || null);
    }

    setMedia(updatedMedia);
  };

  const selectProductProfile = (item) => {
    if (item.type === "video") {
      Alert.alert("Videos cannot be set as the product profile image.");
      return;
    }
    setProductProfile(item);

    // Move the selected item to the head of the media array
    setMedia((prevMedia) => {
      const updatedMedia = prevMedia.filter(
        (mediaItem) => mediaItem.uri !== item.uri
      );

      const newMedia = [item, ...updatedMedia];

      return newMedia;
    });
  };

  //bottom sheet
  const { isBottomSheetOpened, setIsBottomSheetOpened } = useGlobalContext();

  const bottomSheetRef = useRef(null);
  const [bottomSheetComp, setBottomSheetComp] = useState("");

  const initialSnapPoints =
    bottomSheetComp === "success-edit" ? [200, 200] : [100, 500];

  const openBottomSheet = (comp) => {
    setIsBottomSheetOpened(true);
    setBottomSheetComp(comp);
    hideTabs()
    if (bottomSheetRef.current) {
      bottomSheetRef.current.snapToIndex(1);
    }
  };

  const closeBottomSheet = () => {
    setIsBottomSheetOpened(false);
    showTabs()
    if (bottomSheetRef.current) {
      bottomSheetRef.current.close();
    }
  };

  // advice card
  const adviceItems = [
    {
      image: "adv2",
      title: "Use a Clean Background",
      text: "Ensure the background is clean and uncluttered so that the focus remains on the product.",
    },
    {
      image: "adv3",
      title: "Show Different Angles",
      text: "Take photos of your product from multiple angles to give customers a full view of what they are buying.",
    },
    {
      image: "adv1",
      title: "Highlight Product Details",
      text: "Include close-up shots to show the details and textures of your product, highlighting what makes it unique.",
    },
  ];

  // handle create product

  const [productData, setProductData] = useState({
    name: "",
    description: "",
    price: "",
    quantity: "",
    tags: "",
    minQuantity: "",
    special: false,
    storeId: userData?.store.id,
    categoryId: "",
    documents: [],
  });

  //  //handle choose category

  const [selectedCategory, setSelectedCategory] = useState();

  // submitting

  const [isLoading, setIsLoading] = useState(false);

  const handleUploadMedia = async (media) => {
    const uploadPromises = media.map(async (item) => {
      const storageRef = ref(storage, `products/${item.uri.split("/").pop()}`);
      const img = await fetch(item.uri);
      const bytes = await img.blob();
      await uploadBytes(storageRef, bytes);
      const downloadURL = await getDownloadURL(storageRef);
      return downloadURL;
    });
    return Promise.all(uploadPromises);
  };

  const [errors, setErrors] = useState({});

  const handleSubmit = async () => {
    let newErrors = {};

    // Check for required fields
    if (!productData.name) newErrors.name = "Title is required";
    if (!productData.price) newErrors.price = "Price is required";
    if (!productData.minQuantity)
      newErrors.minQuantity = "Min Order Qte is required";
    if (!productData.quantity)
      newErrors.quantity = "Stock Quantity is required";
    if (!selectedCategory) newErrors.categoryId = "Category is required";

    if (Object.keys(newErrors).length > 0 || !media.length) {
      setErrors(newErrors);
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    setIsLoading(true);
    try {
      const mediaUrls = await handleUploadMedia(media);
      const documents = mediaUrls;
      const response = await seller.createProduct(
        {
          ...productData,
          categoryId: selectedCategory,
          documents,
        },
        userData.id,
        userToken
      );
      setRefreshProduct(!refreshProduct);
      openBottomSheet("success-edit");
    } catch (error) {
      console.error("Error adding product:", error);
      Alert.alert("Error adding product");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <GestureHandlerRootView className="flex-1">
      <SafeAreaView className="relative flex-1">
        {isBottomSheetOpened && (
          <TouchableWithoutFeedback onPress={() => closeBottomSheet()}>
            <View
              className="absolute h-full w-full z-[10]"
              style={{ backgroundColor: "rgba(0, 0, 0, 0.4)" }}
            />
          </TouchableWithoutFeedback>
        )}
        <ScrollView showsVerticalScrollIndicator={false}>
          <View className="bg-white w-full h-full justify-between min-h-screen mt-[2px] p-4">
            <View className="flex flex-row items-center mb-4">
              <View className="z-[10] flex justify-center items-center h-[48px] w-[48px] border-[2px] border-dark-lighter rounded-full bg-gray-lighter">
                {userData?.store.picture ? (
                  <Image
                    source={{ uri: userData.store.picture }}
                    className="w-full h-full rounded-full"
                    resizeMode="cover"
                  />
                ) : (
                  <Image
                    source={icons.uploadStorePic}
                    className="w-[40px] h-[40px]"
                    resizeMode="contain"
                  />
                )}
              </View>
              <View className="ml-4">
                {userData?.store.name ? (
                  <Text className="text-primary font-psemibold">
                    {userData.store.name}
                  </Text>
                ) : (
                  <Text className="text-primary font-psemibold">My Store</Text>
                )}
                <Text className="text-primary-light font-pregular text-xs">
                  Listing on Jomark
                </Text>
              </View>
            </View>

            <View className="flex items-center mb-1">
              {!media.length && (
                <TouchableOpacity
                  onPress={pickMedia}
                  className={`w-full flex justify-center items-center h-[100px] border border-gray-300 p-4 rounded-lg bg-gray-100`}
                >
                  <MaterialIcons
                    name="add-to-photos"
                    size={24}
                    color="#7092a8"
                  />
                  <Text className="font-pregular text-accent-light">
                    Add Photos or Videos
                  </Text>
                </TouchableOpacity>
              )}
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                className="flex flex-row w-full"
              >
                {media.length > 0 &&
                  media.map((item, index) => (
                    <TouchableOpacity
                      onPress={() => selectProductProfile(item)}
                      key={index}
                    >
                      <View
                        key={index}
                        className={`relative w-24 h-24 mr-2 rounded-lg ${
                          item.uri === productProfile.uri
                            ? "border-2 border-accent"
                            : ""
                        }`}
                      >
                        <Image
                          source={{ uri: item.uri }}
                          className={`w-full h-full rounded-lg`}
                          resizeMode="cover"
                        />
                        <TouchableOpacity
                          onPress={() => removeMedia(index)}
                          className="absolute top-1 right-1 bg-white rounded-full"
                        >
                          <Ionicons
                            name="close-circle-sharp"
                            size={24}
                            color="#253444"
                          />
                        </TouchableOpacity>
                      </View>
                    </TouchableOpacity>
                  ))}
                {media.length && media.length < 10 ? (
                  <TouchableOpacity
                    onPress={pickMedia}
                    className={`flex justify-center items-center h-[100px] border border-gray-300 p-4 rounded-lg bg-gray-100`}
                  >
                    <MaterialIcons
                      name="add-to-photos"
                      size={24}
                      color="#7092a8"
                    />
                    <Text className="font-pregular text-accent-light">
                      Add Photos or Videos
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <></>
                )}
              </ScrollView>
            </View>
            <Text className="font-pregular text-xs text-dark-lighter">
              Photos: {media.length}/10. Choose your listing's main photo first.
            </Text>
            <Text
              onPress={() => openBottomSheet("advice")}
              className="font-pmedium text-xs text-secondary mt-1"
            >
              How to take a great listing photo
            </Text>

            <View>
              <FormField
                value={productData.name}
                placeholder="Title"
                handleChangeText={(e) =>
                  setProductData({ ...productData, name: e })
                }
                inputStyles="border-[1px] border-accent-lighter h-14 rounded-md focus:border-primary"
                otherStyles="space-y-0"
                error={errors.name}
              />
              <View className="flex flex-row">
                <View className="w-1/2 pr-1">
                  <FormField
                    value={productData.price}
                    placeholder="Price"
                    handleChangeText={(e) =>
                      setProductData({ ...productData, price: e })
                    }
                    inputStyles="border-[1px] border-accent-lighter h-14 rounded-md focus:border-primary"
                    otherStyles="space-y-0"
                    keyboardType="numeric"
                    label="DA"
                    error={errors.price}
                  />
                </View>
                <View className="w-1/2 pl-1">
                  <FormField
                    value={productData.minQuantity}
                    placeholder="Min Order Qte"
                    handleChangeText={(e) =>
                      setProductData({ ...productData, minQuantity: e })
                    }
                    inputStyles="border-[1px] border-accent-lighter h-14 rounded-md focus:border-primary"
                    otherStyles="space-y-0"
                    error={errors.minQuantity}
                    keyboardType="numeric"
                  />
                </View>
              </View>
              <FormField
                value={productData.quantity}
                placeholder="Stock Quantity"
                handleChangeText={(e) =>
                  setProductData({ ...productData, quantity: e })
                }
                inputStyles="border-[1px] border-accent-lighter h-14 rounded-md focus:border-primary"
                otherStyles="space-y-0"
                error={errors.quantity}
                keyboardType="numeric"
              />
              <TouchableWithoutFeedback
                onPress={() => openBottomSheet("category")}
              >
                <View className="border-[1px] border-accent-lighter h-14 rounded-md mt-7 flex flex-row items-center justify-between p-4">
                  <Text className="text-accent-light font-psemibold text-base">
                    {selectedCategory
                      ? categories.data.find(
                          (cat) => cat.id === selectedCategory
                        )?.name
                      : "Category"}
                  </Text>
                  <MaterialIcons
                    name="keyboard-arrow-down"
                    size={24}
                    color="#496686"
                  />
                </View>
              </TouchableWithoutFeedback>
              <FormField
                value={productData.description}
                placeholder="Description"
                handleChangeText={(e) =>
                  setProductData({ ...productData, description: e })
                }
                inputStyles="border-[1px] border-accent-lighter h-14 rounded-md focus:border-primary"
                otherStyles="space-y-0"
                optional={true}
              />
              <CustomButton
                title="Submit Product"
                handlePress={handleSubmit}
                containerStyles="w-full mt-4 rounded-lg bg-secondary min-h-[48px]"
                textStyles="text-white"
                isLoading={isLoading}
              />
            </View>
          </View>
        </ScrollView>

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
            {bottomSheetComp === "advice" && (
              <View className="p-4 flex items-center">
                <Text className="font-psemibold text-lg text-dark">
                  Tips for Taking Great Listing Photos
                </Text>
                <Text className="font-pregular text-base text-center text-dark-light">
                  Maximize Your Product Appeal with These Expert Photography
                  Tips
                </Text>

                <BottomSheetScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  className="flex flex-row w-full"
                >
                  {adviceItems.map((advice, index) => (
                    <Card
                      key={index}
                      image={advice.image}
                      cardTitle={advice.title}
                      cardText={advice.text}
                    />
                  ))}
                </BottomSheetScrollView>
              </View>
            )}

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
                          if (cat.id === selectedCategory) {
                            setSelectedCategory("");
                          } else {
                            setSelectedCategory(cat.id);
                          }
                        }}
                        isSelected={selectedCategory === cat.id}
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
                    Product has been added successfully
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

export default NewProduct;
