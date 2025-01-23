import {
  View,
  SafeAreaView,
  Image,
  ScrollView,
  ActivityIndicator,
  Text,
  Dimensions,
  StatusBar,
  TouchableOpacity,
  Animated,
  TouchableWithoutFeedback,
} from "react-native";
import React, { useState, useEffect, useLayoutEffect, useRef } from "react";
import { useLocalSearchParams, useNavigation } from "expo-router";
import productService from "@/services/product";
import { useGlobalContext } from "@/context/GlobalProvider";
import {
  SearchBar,
  CustomButton,
  StarRating,
  LoadingBar,
  SectionUserReview,
} from "@/components";
import { ProductHorizentalContainer, MasonryListContainer } from "@/containers";
import { MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import BottomSheet, {
  BottomSheetView,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import {
  GestureHandlerRootView,
  PanGestureHandler,
} from "react-native-gesture-handler";
import { useFocusEffect } from "@react-navigation/native";

const { width, height } = Dimensions.get("window");

const ProductDetails = () => {
  const { showTabs, hideTabs } = useGlobalContext();
  const navigation = useNavigation();

  useFocusEffect(
    React.useCallback(() => {
      hideTabs()
      return () => showTabs();
    }, [])
  );

  const { id } = useLocalSearchParams();
  const [isProductLoading, setIsProductLoading] = useState(false);
  const [product, setProduct] = useState({});

  const fetchProductDetails = async () => {
    setIsProductLoading(true);
    try {
      const res = await productService.getProductById(id);
      setProduct(res.data.data);
      fetchStoreProduct(res.data.data.storeId);
    } catch (error) {
      Alert.alert("Error fetching product details:", error);
    } finally {
      setIsProductLoading(false);
    }
  };

  useEffect(() => {
    fetchProductDetails();
  }, []);

  const [isStoreProductLoading, setIsStoreProductLoading] = useState(false);
  const [storeProducts, setStoreProducts] = useState([]);

  const fetchStoreProduct = async (storeId) => {
    setIsStoreProductLoading(true);
    try {
      const res = await productService.getProductByStore(storeId);
      setStoreProducts(res.data.data);
    } catch (error) {
      Alert.alert("Error fetching store products:", error);
    } finally {
      setIsStoreProductLoading(false);
      fetchProducts();
    }
  };

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

  const [currentIndex, setCurrentIndex] = useState(0);
  const handleScroll = (event) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.floor(contentOffsetX / width);
    setCurrentIndex(index);
  };

  const [selectedReview, setSelectedReview] = useState("product");

  // scroll header
  const [isHeaderTransparent, setIsHeaderTransparent] = useState(true);

  const handleScrolling = (event) => {
    const scrollY = event.nativeEvent.contentOffset.y;
    if (scrollY > 100 && isHeaderTransparent) {
      setIsHeaderTransparent(false);
    } else if (scrollY <= 100 && !isHeaderTransparent) {
      setIsHeaderTransparent(true);
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTransparent: isHeaderTransparent,
      headerStyle: {
        backgroundColor: isHeaderTransparent ? "transparent" : "#fff",
      },
      headerTitleStyle: {
        color: isHeaderTransparent ? "transparent" : "#000",
      },
    });
  }, [isHeaderTransparent]);

  // Bottom sheet
  const { isBottomSheetOpened, setIsBottomSheetOpened } = useGlobalContext();
  const bottomSheetRef = useRef(null);
  const [bottomSheetComp, setBottomSheetComp] = useState("");

  const [initialSnapPoints, setInitialSnapPoints] = useState([100, 200]);

  const openBottomSheet = (comp, snap) => {
    setBottomSheetComp(comp);
    setInitialSnapPoints(snap);
    hideTabs();
    if (comp === "cart") setQuantity(product.minQuantity);
    if (bottomSheetRef.current) {
      bottomSheetRef.current.snapToIndex(1);
    }
    setIsBottomSheetOpened(true);
  };

  const closeBottomSheet = () => {
    setIsBottomSheetOpened(false);
    if (bottomSheetRef.current) {
      bottomSheetRef.current.close();
    }
  };

  const [quantity, setQuantity] = useState(0);

  return (
    <GestureHandlerRootView>
      <View className="flex-1 bg-white">
        {isProductLoading ? (
          <View className=" flex flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#fd7014" className="mt-5" />
          </View>
        ) : (
          <ScrollView
            showsVerticalScrollIndicator={false}
            onScroll={handleScrolling}
            scrollEventThrottle={16}
          >
            {product.media && product.media.length > 0 ? (
              <View className="relative">
                <ScrollView
                  horizontal
                  pagingEnabled
                  showsHorizontalScrollIndicator={false}
                  onScroll={handleScroll}
                  style={{ width, height: width }}
                >
                  {product.media?.map((image, index) => (
                    <Image
                      key={index}
                      source={{ uri: image }}
                      style={{ width, height: width }}
                      resizeMode="cover"
                    />
                  ))}
                </ScrollView>
                <View
                  className="absolute bottom-4 w-[100] bg-[#25344475] py-1 rounded-full"
                  style={{ left: width / 2 - 50 }}
                >
                  <Text className="text-center font-pmedium text-white text-xs mt-[2px]">
                    {`Item ${currentIndex + 1}/${product.media?.length || 0}`}
                  </Text>
                </View>
              </View>
            ) : (
              <View className="justify-center items-center h-[300px] bg-gray-200">
                <Text>No images available</Text>
              </View>
            )}
            <View className="mt-[-10px] pt-4 px-4 bg-white rounded-t-xl">
              <Text numberOfLines={2} className="text-md font-pmedium">
                {product.name}
              </Text>
              <View className="flex-row items-center mt-1">
                <StarRating rating={4.7} size={12} color="#fd7014" />
                <Text className="text-xs font-pregular ml-1">
                  4.7 | 2,000+ sold
                </Text>
              </View>
              <View className="mt-4">
                <Text className="text-2xl text-dark font-psemibold">
                  {product.price} DA
                </Text>
                <Text className="text-xs font-pregular mt-1">
                  Min. order: {product.minQuantity} pieces
                </Text>
                {product.description && (
                  <Text className="text-xs font-pregular mt-4">
                    {product.description}
                  </Text>
                )}
              </View>
            </View>
            <View className="mt-4 border-t-8 border-gray-100 px-4 py-4">
              <View className="flex-row justify-between items-center">
                <Text className="font-pmedium text-base">Reviews</Text>
                <Feather name="chevron-right" size={18} color="#253444" />
              </View>
              <View className="flex-row items-center mt-4">
                <Text
                  onPress={() => setSelectedReview("product")}
                  className={`font-pregular text-sm pb-2 ${
                    selectedReview === "product"
                      ? "text-md text-dark font-pmedium border-b-2 border-dark"
                      : ""
                  }`}
                >
                  Product reviews (4)
                </Text>
                <Text
                  onPress={() => setSelectedReview("store")}
                  className={`ml-6 font-pregular text-sm pb-2 ${
                    selectedReview === "store"
                      ? "text-md text-dark font-pmedium border-b-2 border-dark pb-2"
                      : ""
                  }`}
                >
                  Store reviews (128)
                </Text>
              </View>
              {selectedReview === "store" && (
                <View className="mt-4 mb-8">
                  <View className="flex flex-row items-center">
                    <Text className="text-2xl font-pbold text-dark">4.7 </Text>
                    <Text className="text-lg font-psemibold text-dark mt-1">
                      /5
                    </Text>
                  </View>
                  <View className="flex flex-row justify-between items-center">
                    <View>
                      <Text>Supplier service</Text>
                      <Text>On-time shipment</Text>
                      <Text>Product quality</Text>
                    </View>
                    <View className="w-[50%] mt-1 flex flex-row items-center mr-2">
                      <View className="w-[92%]">
                        <LoadingBar
                          percentage={(4.7 * 100) / 5}
                          containerStyle="mb-3"
                        />
                        <LoadingBar
                          percentage={(4.7 * 100) / 5}
                          containerStyle="mb-3"
                        />
                        <LoadingBar percentage={(4.7 * 100) / 5} />
                      </View>
                      <View className="text-xs">
                        <Text>4.7</Text>
                        <Text>4.7</Text>
                        <Text>4.7</Text>
                      </View>
                    </View>
                  </View>
                </View>
              )}
              {selectedReview === "product" && (
                <View className="mt-4">
                  <View className="flex-row items-center mt-1 mb-2">
                    <Text className="text-xl font-psemibold mt-1 mr-4">
                      4.7
                    </Text>
                    <StarRating rating={4.7} size={22} color="#fd7014" />
                  </View>
                  <SectionUserReview />
                  <SectionUserReview />
                </View>
              )}
            </View>
            <View className="mt-4 border-t-8 border-gray-100">
              <ProductHorizentalContainer
                title="Discover more from this store"
                data={storeProducts
                  .filter((pr) => pr.categoryId === product.categoryId)
                  ?.slice(0, 10)}
                isLoading={isStoreProductLoading}
                handleOpenPress={() =>
                  openBottomSheet("storeProducts", [590, 590])
                }
              />
            </View>
            <View className="mt-4 border-t-8 border-gray-100 py-2">
              <Text className="font-pmedium text-dark text-base px-4 mb-2">
                You may like
              </Text>
              <MasonryListContainer
                data={products.filter(
                  (pr) => pr.categoryId === product.categoryId
                )}
                loading={isProdutsLoading}
              />
            </View>
          </ScrollView>
        )}
        <View className="px-4 py-3 border-t border-gray-200 bg-white flex flex-row items-center justify-between">
          <View className="flex-row items-center justify-between mr-2">
            <TouchableOpacity className="mr-4">
              <MaterialCommunityIcons
                name="storefront-outline"
                size={24}
                color="#496686"
              />
            </TouchableOpacity>
            <TouchableOpacity className="mr-4">
              <MaterialCommunityIcons
                name="message-processing-outline"
                size={24}
                color="#496686"
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => openBottomSheet("cart", [590, 590])}
              className=""
            >
              <MaterialCommunityIcons
                name="cart-plus"
                size={24}
                color="#496686"
              />
            </TouchableOpacity>
          </View>
          <View className="flex-row items-center justify-end">
            <CustomButton
              title="Send Inquery"
              //handlePress={resetFilters}
              containerStyles="rounded-full bg-white border border-accent min-h-[38px] w-[100px] mr-2  text-center"
              textStyles="text-accent text-xs"
            />
            <CustomButton
              title="Start Order"
              //handlePress={applyFilters}
              containerStyles="rounded-full bg-secondary min-h-[38px] w-[100px] text-center"
              textStyles="text-white text-xs"
            />
          </View>
        </View>
        <BottomSheet
          ref={bottomSheetRef}
          index={-1}
          snapPoints={initialSnapPoints}
          enablePanDownToClose={true}
          onClose={() => closeBottomSheet()}
          containerStyle={{
            zIndex: 150,
          }}
        >
          {bottomSheetComp === "storeProducts" && (
            <View className="border-b-[1px] border-gray-lighter p-2 w-full">
              <Text className="font-pmedium text-lg text-center">
                Discover more from this store
              </Text>
            </View>
          )}
          <BottomSheetScrollView className="flex-1">
            <View className="w-full">
              {bottomSheetComp === "storeProducts" && (
                <View className="py-2">
                  <MasonryListContainer
                    data={storeProducts.filter(
                      (pr) => pr.categoryId === product.categoryId
                    )}
                    loading={isStoreProductLoading}
                  />
                </View>
              )}
              {bottomSheetComp === "cart" && (
                <View className="w-full">
                  <Image
                    source={{ uri: product.media[0] }}
                    className="w-full h-[250px]"
                    resizeMode="cover"
                  />
                  <View className="px-4 mt-4">
                    <Text numberOfLines={2} className="text-lg font-pmedium">
                      {product.name}
                    </Text>
                    <View className="flex-row items-center mt-1">
                      <StarRating rating={4.7} size={12} color="#fd7014" />
                      <Text className="text-xs font-pregular ml-1">
                        4.7 | 2,000+ sold
                      </Text>
                    </View>
                    <Text className="text-2xl text-dark font-psemibold mt-2">
                      {product.price} DA
                    </Text>
                    <View className="mt-6 flex-row items-center">
                      <Text className="font-pmedium mr-3 text-lg">Qty</Text>
                      <View className="border border-gray-300 rounded-full flex flex-row items-center justify-between py-2 w-[110px]">
                        <TouchableOpacity
                          className="flex-1 items-center"
                          onPress={() => setQuantity(quantity - 1)}
                          disabled={quantity <= product.minQuantity}
                        >
                          <MaterialCommunityIcons
                            name="minus"
                            size={24}
                            color={
                              quantity <= product.minQuantity
                                ? "#D5D5D5"
                                : "black"
                            }
                          />
                        </TouchableOpacity>
                        <Text>{quantity}</Text>
                        <TouchableOpacity
                          onPress={() => setQuantity(quantity + 1)}
                          className="flex-1 items-center"
                        >
                          <MaterialCommunityIcons
                            name="plus"
                            size={24}
                            color="black"
                          />
                        </TouchableOpacity>
                      </View>
                      <Text className="font-pregular ml-3 text-md text-gray-400">
                        Min. {product.minQuantity} pcs
                      </Text>
                    </View>
                  </View>
                </View>
              )}
            </View>
          </BottomSheetScrollView>
          {bottomSheetComp === "cart" && (
            <View className="p-4 bg-white flex-row justify-between">
              <View className="mr-12">
                <Text className="font-pregular text-gray-400">Total price</Text>
                <Text className="text-2xl text-dark font-psemibold mt-1">
                  {product.price * quantity} DA
                </Text>
              </View>
              <CustomButton
                title="Add to cart"
                containerStyles="px-6 flex-1 rounded-full bg-secondary min-h-[42px]"
                textStyles="text-white text-[16px]"
              />
            </View>
          )}
        </BottomSheet>
        <StatusBar backgroundColor="transparent" barStyle="dark-content" />
      </View>
    </GestureHandlerRootView>
  );
};

export default ProductDetails;
