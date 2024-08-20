import React, { useRef, useEffect, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Animated,
  StatusBar,
  Dimensions,
  Image,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useAuthContext } from "@/context/AuthProvider";
import { useGlobalContext } from "@/context/GlobalProvider";
import Feather from "@expo/vector-icons/Feather";
import { Navigation } from "@/components";
import images from "../../../../constants/images";
import {
  ProductHorizentalContainer,
  MasonryListContainer,
  DiscoverContainer,
} from "@/containers";
import { router } from "expo-router";
import productService from "@/services/product";

const Home = () => {
  const { logout } = useAuthContext();
  const { setIsBottomSheetOpened, showTabs, hideTabs } = useGlobalContext();

  useEffect(() => {
    setIsBottomSheetOpened(false);
    showTabs();
  }, []);

  // fetch new arrivals

  const [newArrivals, setNewArrivals] = useState([]);
  const [isNewArrivalsLoading, setIsNewArrivalsLoading] = useState(false);

  const fetchNewArrivals = async () => {
    setIsNewArrivalsLoading(true);
    try {
      const res = await productService.getNewArrivals();
      setNewArrivals(res.data.data);
    } catch (error) {
      Alert.alert("Error fetching new arrivals:", error);
    } finally {
      setIsNewArrivalsLoading(false);
    }
  };

  useEffect(() => {
    fetchNewArrivals();
  }, []);

  // fetch all products
  const [products, setProducts] = useState([]);
  const [isProdutsLoading, setIsProdutsLoading] = useState(false);

  const fetchProducts = async () => {
    setIsProdutsLoading(true);
    try {
      const res = await productService.getProductsForBuyer();
      setProducts(res.data.data);
    } catch (error) {
      Alert.alert("Error fetching products:", error);
    } finally {
      setIsProdutsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const [selectedTab, setSelectedTab] = useState("Products");

  const selectedColor = selectedTab === "Products" ? "#fd7014" : "#374d65";

  return (
    <SafeAreaView className="relative h-full bg-[#f5f5f5]">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View
          className="px-4 pt-[62]"
          style={{ backgroundColor: selectedColor }}
        >
          <View className="flex flex-row justify-between items-center">
            <View className="flex-row items-center">
              <Feather name="shopping-bag" size={18} color="white" />
              <Text className="ml-2 text-white text-xs font-pregular ">
                Sell on Jomark
              </Text>
            </View>
            <View className="px-2 py-1 rounded-full bg-secondary-light ">
              <Text className="text-white text-[10px] font-pregular">
                Support Center
              </Text>
            </View>
          </View>
          <Navigation
            selectedTab={selectedTab}
            setSelectedTab={setSelectedTab}
          />
          <View className="flex flex-row justify-between items-center bg-white p-1 rounded-full">
            <Text className="ml-4 font-pregular mt-[1px] text-dark-lighter text-xs">
              Find what you're looking for...
            </Text>
            <View className="bg-dark px-3 py-1 rounded-full">
              <Feather name="search" size={24} color="white" />
            </View>
          </View>
        </View>
        <LinearGradient
          colors={[selectedColor, "#f5f5f5"]}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={{
            width: Dimensions.get("window").width,

            overflow: "visible",
          }}
        >
          {selectedTab === "Products" && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="flex flex-row w-full mt-4"
            >
              <View className="bg-white rounded-md py-1 px-2 flex-row items-center mr-1 w-[135px] ml-4">
                <Image
                  source={images.pick}
                  className="w-[45px] h-[45px]"
                  resizeMode="contain"
                />
                <Text className="font-pmedium text-xs text-dark">
                  Browse {" \n"}
                  Categories
                </Text>
              </View>
              <View className="bg-white rounded-md py-1 px-2 flex-row items-center mr-1 w-[135px]">
                <Image
                  source={images.target}
                  className="w-[45px] h-[45px]"
                  resizeMode="contain"
                />
                <Text className="font-pmedium text-xs text-dark">
                  Request for {" \n"}
                  Quotation
                </Text>
              </View>
              <View className="bg-white rounded-md py-1 px-2 flex-row items-center mr-1 w-[135px]">
                <Image
                  source={images.guide}
                  className="w-[45px] h-[45px]"
                  resizeMode="contain"
                />
                <Text className="font-pmedium text-xs text-dark">
                  New User{" \n"}
                  Guide
                </Text>
              </View>
            </ScrollView>
          )}
        </LinearGradient>
        {selectedTab === "Products" && (
          <View>
            <ProductHorizentalContainer
              title="New Arrivals"
              sub="Shop the Newest Collections"
              handleOpenPress={() => router.push("/buyer/new-arrivals")}
              data={newArrivals?.slice(0, 10)}
              isLoading={isNewArrivalsLoading}
            />
            <ProductHorizentalContainer
              title="Top Ranking"
              sub="Explore Trends with Data-Backed Rankings"
            />
            <View className="bg-white mt-2 py-2">
              <Text className="font-pmedium text-dark text-base px-4 mb-2">
                You may like
              </Text>
              <MasonryListContainer
                data={products}
                loading={isProdutsLoading}
              />
            </View>
          </View>
        )}
        {selectedTab === "Discover Stores" && <DiscoverContainer />}
      </ScrollView>
      <StatusBar backgroundColor={selectedColor} barStyle="light-content" />
    </SafeAreaView>
  );
};

export default Home;
