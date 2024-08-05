import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Alert,
} from "react-native";
import categories from "@/constants/categories";
import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  SearchBar,
  CustomButton,
  FormField,
  CustomSelectButton,
  CustomSelectDropDown,
} from "@/components";
import { MasonryListContainer, SellerProductsContainer } from "@/containers";
import { useAuthContext } from "@/context/AuthProvider";
import { useGlobalContext } from "@/context/GlobalProvider";
import { MaterialIcons } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { router } from "expo-router";
import seller from "../../../../services/seller";
import BottomSheet, {
  BottomSheetView,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import {
  GestureHandlerRootView,
  PanGestureHandler,
} from "react-native-gesture-handler";
import product from "../../../../services/product";

const SellerProducts = () => {
  const [searchText, setSearchText] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const { userToken } = useAuthContext();
  const { userData, refreshProduct, setRefreshProduct, showTabs, hideTabs } =
    useGlobalContext();

  // Fetch products
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const res = await seller.getProducts(userData.id, userToken);
      setProducts(res.data.data);
      setFiltredProducts(res.data.data);
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

  // Bottom sheet
  const [isBottomSheetOpened, setIsBottomSheetOpened] = useState(false);
  const bottomSheetRef = useRef(null);
  const [bottomSheetComp, setBottomSheetComp] = useState("");

  const [initialSnapPoints, setInitialSnapPoints] = useState([100, 200]);

  const openBottomSheet = (comp, snap) => {
    setBottomSheetComp(comp);
    setInitialSnapPoints(snap);
    if (bottomSheetRef.current) {
      bottomSheetRef.current.snapToIndex(1);
    }
    setIsBottomSheetOpened(true);
    hideTabs();
  };

  const closeBottomSheet = () => {
    setIsBottomSheetOpened(false);
    showTabs();
    if (bottomSheetRef.current) {
      bottomSheetRef.current.close();
    }
  };

  // Edit product
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
  });

  const [selectedCategory, setSelectedCategory] = useState();
  const [errors, setErrors] = useState({});
  const [isEditLoading, setIsEditLoading] = useState(false);

  const handleEdit = async () => {
    let newErrors = {};

    // Check for required fields
    if (!productData.name) newErrors.name = "Title is required";
    if (!productData.price) newErrors.price = "Price is required";
    if (!productData.minQuantity)
      newErrors.minQuantity = "Min Order Qte is required";
    if (!productData.quantity)
      newErrors.quantity = "Stock Quantity is required";
    if (!productData.categoryId) newErrors.categoryId = "Category is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    setIsEditLoading(true);
    try {
      const response = await product.editProduct(
        productData,
        productData.id,
        userToken
      );
      setRefreshProduct(!refreshProduct);
      openBottomSheet("success-edit", [100, 200]);
    } catch (error) {
      console.error("Error editing product:", error);
      Alert.alert("Error editing product");
    } finally {
      setIsEditLoading(false);
    }
  };

  // Filter state
  const [filterData, setFilterData] = useState({
    minPrice: "",
    maxPrice: "",
    minSales: "",
    maxSales: "",
    minOrders: "",
    maxOrders: "",
    categoryId: "",
  });

  const [filtredProducts, setFiltredProducts] = useState(products);

  const applyFilters = () => {
    const filteredProducts = products.filter((product) => {
      const {
        minPrice,
        maxPrice,
        minSales,
        maxSales,
        minOrders,
        maxOrders,
        categoryId,
      } = filterData;

      const priceMatch =
        (minPrice ? product.price >= Number(minPrice) : true) &&
        (maxPrice ? product.price <= Number(maxPrice) : true);

      const salesMatch =
        (minSales ? product.sales >= Number(minSales) : true) &&
        (maxSales ? product.sales <= Number(maxSales) : true);

      const ordersMatch =
        (minOrders ? product.orders >= Number(minOrders) : true) &&
        (maxOrders ? product.orders <= Number(maxOrders) : true);

      const categoryMatch = categoryId
        ? product.categoryId == categoryId
        : true;

      const searchMatch = product.name
        .toLowerCase()
        .includes(searchText.toLowerCase());

      return (
        priceMatch && salesMatch && ordersMatch && categoryMatch && searchMatch
      );
    });

    setFiltredProducts(filteredProducts);
    closeBottomSheet();
  };

  const resetFilters = () => {
    setFilterData({
      minPrice: "",
      maxPrice: "",
      minSales: "",
      maxSales: "",
      minOrders: "",
      maxOrders: "",
      categoryId: "",
    });
    setFiltredProducts(products);
  };

  return (
    <GestureHandlerRootView className="flex-1">
      <SafeAreaView className="relative flex-1">
        {bottomSheetRef.current && isBottomSheetOpened && (
          <TouchableWithoutFeedback onPress={() => closeBottomSheet()}>
            <View
              className="absolute h-full w-full z-[10]"
              style={{ backgroundColor: "rgba(0, 0, 0, 0.4)" }}
            />
          </TouchableWithoutFeedback>
        )}
        <View className="bg-white">
          <View className="flex flex-row w-full items-center justify-between px-4 pt-4 border-t border-gray-200">
            {!isSearchOpen ? (
              <TouchableOpacity onPress={() => setIsSearchOpen(true)}>
                <MaterialIcons name="search" size={24} color="#496686" />
              </TouchableOpacity>
            ) : (
              <SearchBar
                placeholder="Search..."
                value={searchText}
                handleChangeText={setSearchText}
                toggleSearch={setIsSearchOpen}
                otherStyles="flex-1"
                handleSearchClick={applyFilters}
              />
            )}
            {!isSearchOpen && (
              <View className="flex flex-row ">
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
                  title="Filter"
                  handlePress={() => openBottomSheet("filter", [100, 590])}
                  containerStyles="ml-2 min-h-[32px] rounded-full bg-white border-[1px] border-accent px-4"
                  icon="filter-alt"
                  iconColor="#496686"
                  iconSize={20}
                  textStyles="text-accent text-xs"
                />
              </View>
            )}
          </View>
          <View className="">
            <View className="py-4 min-h-screen">
              <SellerProductsContainer
                loading={isLoading}
                data={filtredProducts}
                openBottomSheet={openBottomSheet}
                setProductData={setProductData}
              />
            </View>
          </View>
        </View>
        <BottomSheet
          ref={bottomSheetRef}
          index={-1}
          snapPoints={initialSnapPoints}
          enablePanDownToClose={true}
          onClose={() => closeBottomSheet()}
          containerStyle={{ zIndex: 1500 }}
        >
          {bottomSheetComp === "edit" && (
            <View className="border-b-[1px] border-gray-lighter p-2 w-full">
              <Text className="font-pmedium text-lg text-center">
                Edit Product
              </Text>
            </View>
          )}
          {bottomSheetComp === "filter" && (
            <View className="border-b-[1px] border-gray-lighter p-2 w-full">
              <Text className="font-pmedium text-lg text-center">Filters</Text>
            </View>
          )}
          <BottomSheetScrollView showsVerticalScrollIndicator={false}>
            <View>
              {bottomSheetComp === "edit" && (
                <View className="flex items-center w-full">
                  <ScrollView
                    className="px-2"
                    showsVerticalScrollIndicator={false}
                    nestedScrollEnabled
                  >
                    <FormField
                      value={productData.name}
                      title="Title"
                      placeholder="Title"
                      handleChangeText={(e) =>
                        setProductData({ ...productData, name: e })
                      }
                      inputStyles="border-[1px] border-accent-lighter h-14 rounded-md focus:border-primary"
                      otherStyles="space-y-0 mt-2"
                      error={errors.name}
                    />
                    <View className="flex flex-row">
                      <View className="w-1/2 pr-1">
                        <FormField
                          value={productData.price}
                          title="Price"
                          placeholder="Price"
                          handleChangeText={(e) =>
                            setProductData({ ...productData, price: e })
                          }
                          inputStyles="border-[1px] border-accent-lighter h-14 rounded-md focus:border-primary"
                          otherStyles="space-y-0 mt-2"
                          keyboardType="numeric"
                          label="DA"
                          error={errors.price}
                        />
                      </View>
                      <View className="w-1/2 pl-1">
                        <FormField
                          value={productData.minQuantity}
                          title="Min Order Qte"
                          placeholder="Min Order Qte"
                          handleChangeText={(e) =>
                            setProductData({ ...productData, minQuantity: e })
                          }
                          inputStyles="border-[1px] border-accent-lighter h-14 rounded-md focus:border-primary"
                          otherStyles="space-y-0 mt-2"
                          error={errors.minQuantity}
                        />
                      </View>
                    </View>
                    <FormField
                      value={productData.quantity}
                      title="Stock Quantity"
                      placeholder="Stock Quantity"
                      handleChangeText={(e) =>
                        setProductData({ ...productData, quantity: e })
                      }
                      inputStyles="border-[1px] border-accent-lighter h-14 rounded-md focus:border-primary"
                      otherStyles="space-y-0 mt-2"
                      error={errors.quantity}
                    />
                    <CustomSelectDropDown
                      data={categories.data.map((cat) => ({
                        label: cat.name,
                        value: cat.id,
                      }))}
                      title="Category"
                      placeholder="Category"
                      containerStyles="mt-2"
                      handleOnValueChange={(e) => {
                        setProductData({
                          ...productData,
                          categoryId: e,
                        });
                      }}
                    />
                    <FormField
                      value={productData.description}
                      title="Description"
                      placeholder="Description"
                      handleChangeText={(e) =>
                        setProductData({ ...productData, description: e })
                      }
                      inputStyles="border-[1px] border-accent-lighter h-14 rounded-md focus:border-primary"
                      otherStyles="space-y-0 mt-2"
                      optional={true}
                      error={errors.description}
                    />
                    <CustomButton
                      title="Edit Product"
                      handlePress={handleEdit}
                      containerStyles="w-full mt-4 rounded-lg bg-secondary min-h-[48px]"
                      textStyles="text-white"
                      isLoading={isEditLoading}
                    />
                  </ScrollView>
                </View>
              )}
              {bottomSheetComp === "filter" && (
                <View className="flex items-center w-full">
                  <ScrollView
                    className="px-2"
                    showsVerticalScrollIndicator={false}
                    nestedScrollEnabled
                  >
                    <View className="flex flex-row">
                      <View className="w-1/2 pr-1">
                        <FormField
                          value={filterData.minPrice}
                          title="Min Price"
                          placeholder="Min Price"
                          handleChangeText={(e) =>
                            setFilterData({ ...filterData, minPrice: e })
                          }
                          inputStyles="border-[1px] border-accent-lighter h-14 rounded-md focus:border-primary"
                          otherStyles="space-y-0 mt-2"
                          keyboardType="numeric"
                          label="DA"
                        />
                      </View>
                      <View className="w-1/2 pl-1">
                        <FormField
                          value={filterData.maxPrice}
                          title="Max Price"
                          placeholder="Max Price"
                          handleChangeText={(e) =>
                            setFilterData({ ...filterData, maxPrice: e })
                          }
                          inputStyles="border-[1px] border-accent-lighter h-14 rounded-md focus:border-primary"
                          otherStyles="space-y-0 mt-2"
                          keyboardType="numeric"
                          label="DA"
                        />
                      </View>
                    </View>
                    <View className="flex flex-row">
                      <View className="w-1/2 pr-1">
                        <FormField
                          value={filterData.minSales}
                          title="Min Sales"
                          placeholder="Min Sales"
                          handleChangeText={(e) =>
                            setFilterData({ ...filterData, minSales: e })
                          }
                          inputStyles="border-[1px] border-accent-lighter h-14 rounded-md focus:border-primary"
                          otherStyles="space-y-0 mt-4"
                          keyboardType="numeric"
                        />
                      </View>
                      <View className="w-1/2 pl-1">
                        <FormField
                          value={filterData.maxSales}
                          title="Max Sales"
                          placeholder="Max Sales"
                          handleChangeText={(e) =>
                            setFilterData({ ...filterData, maxSales: e })
                          }
                          inputStyles="border-[1px] border-accent-lighter h-14 rounded-md focus:border-primary"
                          otherStyles="space-y-0 mt-4"
                          keyboardType="numeric"
                        />
                      </View>
                    </View>
                    <View className="flex flex-row">
                      <View className="w-1/2 pr-1">
                        <FormField
                          value={filterData.minOrders}
                          title="Min Orders"
                          placeholder="Min Orders"
                          handleChangeText={(e) =>
                            setFilterData({ ...filterData, minOrders: e })
                          }
                          inputStyles="border-[1px] border-accent-lighter h-14 rounded-md focus:border-primary"
                          otherStyles="space-y-0 mt-4"
                          keyboardType="numeric"
                        />
                      </View>
                      <View className="w-1/2 pl-1">
                        <FormField
                          value={filterData.maxOrders}
                          title="Max Orders"
                          placeholder="Max Orders"
                          handleChangeText={(e) =>
                            setFilterData({ ...filterData, maxOrders: e })
                          }
                          inputStyles="border-[1px] border-accent-lighter h-14 rounded-md focus:border-primary"
                          otherStyles="space-y-0 mt-4"
                          keyboardType="numeric"
                        />
                      </View>
                    </View>
                    <CustomSelectDropDown
                      data={categories.data.map((cat) => ({
                        label: cat.name,
                        value: cat.id,
                      }))}
                      title="Category"
                      placeholder="Category"
                      containerStyles="mt-4"
                      handleOnValueChange={(e) => {
                        setFilterData({
                          ...filterData,
                          categoryId: e,
                        });
                      }}
                    />
                    <CustomButton
                      title="Apply Filters"
                      handlePress={applyFilters}
                      containerStyles="w-full mt-4 rounded-lg bg-secondary min-h-[48px]"
                      textStyles="text-white"
                    />
                    <CustomButton
                      title="Reset Filters"
                      handlePress={resetFilters}
                      containerStyles="w-full mt-2 rounded-lg bg-white border border-accent min-h-[48px]"
                      textStyles="text-accent"
                    />
                  </ScrollView>
                </View>
              )}
              {(bottomSheetComp === "success-edit" ||
                bottomSheetComp === "delete-edit") && (
                <View className="items-center p-4">
                  <Ionicons
                    name="checkmark-done-circle-outline"
                    size={64}
                    color="#1DCC79"
                  />
                  <Text className="font-pmedium mt-2 px-12 text-center text-lg">
                    Product has been{" "}
                    {bottomSheetComp === "success-edit" ? "edited" : "deleted"}{" "}
                    successfully
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

export default SellerProducts;
