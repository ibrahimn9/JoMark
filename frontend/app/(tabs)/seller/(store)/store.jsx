import { View, Text, SafeAreaView, ScrollView, Image } from "react-native";
import { StatusBar } from "expo-status-bar";
import icons from "@/constants/icons";
import { useGlobalContext } from "@/context/GlobalProvider";
import { useAuthContext } from "@/context/AuthProvider";
import React, { useState, useCallback, useEffect } from "react";
import { CustomButton, StoreReviews, StoreAbout } from "@/components";
import { MasonryListContainer } from "@/containers";
import { PanGestureHandler } from "react-native-gesture-handler";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import seller from "../../../../services/seller";
import { router } from "expo-router";

const SellerStore = () => {
  const { userData, refreshProduct, setRefreshProduct } = useGlobalContext();
  const { userToken } = useAuthContext();

  const nav = ["Product", "Reviews", "About"];
  const [selectedNav, setSelectedNav] = useState("Product");
  const storeData = userData.store;

  // fetch products

  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const res = await seller.getProducts(userData.id, userToken);
      setProducts(res.data.data);
    } catch (error) {
      console.error("Error fetching product:", error);
      Alert.alert("Error fetching product");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [refreshProduct]);

  const handleGesture = useCallback(
    ({ nativeEvent }) => {
      // Adjust these thresholds to control the sensitivity and speed of the swipe gesture
      const SWIPE_THRESHOLD = 90; // Increase to make the swipe less sensitive
      const DEBOUNCE_DELAY = 200; // Increase to slow down the gesture handling

      if (nativeEvent.translationX > SWIPE_THRESHOLD) {
        // Swipe right
        const currentIndex = nav.indexOf(selectedNav);
        if (currentIndex > 0) {
          setTimeout(
            () => setSelectedNav(nav[currentIndex - 1]),
            DEBOUNCE_DELAY
          );
        }
      } else if (nativeEvent.translationX < -SWIPE_THRESHOLD) {
        // Swipe left
        const currentIndex = nav.indexOf(selectedNav);
        if (currentIndex < nav.length - 1) {
          setTimeout(
            () => setSelectedNav(nav[currentIndex + 1]),
            DEBOUNCE_DELAY
          );
        }
      }
    },
    [selectedNav]
  );

  return (
    <GestureHandlerRootView>
      <SafeAreaView className="h-full">
        <ScrollView showsVerticalScrollIndicator={false}>
          <View className="bg-white  pb-4">
            <View className="w-full min-h-[85] bg-secondary" />
            <View className="z-[10] ml-5 mt-[-46] flex justify-center items-center h-[68px] w-[68px] border-[2px] border-dark-lighter rounded-full bg-gray-lighter">
              {storeData.picture ? (
                <Image
                  source={{ uri: storeData.picture }}
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
            <View className="w-[72px] ml-5 mt-1 flex justify-center text-center items-center">
              {storeData?.name ? (
                <Text className="text-primary font-psemibold">
                  {storeData.name}
                </Text>
              ) : (
                <Text className="mt-1 text-primary font-psemibold">
                  My Store
                </Text>
              )}

              {storeData?.slogan && (
                <Text className="text-primary-light font-pregular text-xs text-center mb-2">
                  {storeData.slogan}
                </Text>
              )}
            </View>

            
            <View className="px-4 flex flex-row">
              <CustomButton
                title="Add product"
                handlePress={() => router.push("/seller/add-product")}
                containerStyles="min-h-[32px] rounded-full px-4"
                icon="add"
                iconColor="white"
                iconSize={20}
                textStyles="text-white text-xs"
              />
              <CustomButton
                title="Edit store"
                handlePress={() => router.push("/seller/edit-store")}
                containerStyles="ml-2 min-h-[32px] rounded-full bg-white border-[1px] border-accent px-4"
                icon="edit"
                iconColor="#496686"
                iconSize={20}
                textStyles="text-accent text-xs"
              />
            </View>
          </View>
          <View className="bg-white min-h-[550px]">
            <View className="pt-3 flex flex-row px-4 w-full border-b-[8px] border-[#f5f5f5] pb-1">
              {nav.map((n, index) => (
                <Text
                  onPress={() => setSelectedNav(n)}
                  key={index}
                  className={`mr-8 ${
                    selectedNav === n
                      ? "text-secondary border-b-[2px] border-secondary  pb-2 mb-[-5px]"
                      : "text-dark"
                  }`}
                >
                  {n}
                </Text>
              ))}
            </View>
            <View className="mt-4 w-full">
              {selectedNav === "Product" && (
                <MasonryListContainer loading={isLoading} data={products} />
              )}
              {selectedNav === "Reviews" && <StoreReviews />}
              {selectedNav === "About" && <StoreAbout />}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default SellerStore;
