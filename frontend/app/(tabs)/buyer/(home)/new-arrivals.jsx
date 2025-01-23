import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableWithoutFeedback,
  StatusBar,
} from "react-native";
import React, { useState, useEffect, useRef } from "react";
import { ProductHorizentalContainer, MasonryListContainer } from "@/containers";
import {
  SearchBar,
  CustomButton,
  FormField,
  CustomSelectButton,
  CustomSelectDropDown,
} from "@/components";
import { useGlobalContext } from "@/context/GlobalProvider";
import productService from "@/services/product";
import BottomSheet, {
  BottomSheetView,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import {
  GestureHandlerRootView,
  PanGestureHandler,
} from "react-native-gesture-handler";
import categories from "@/constants/categories";
import { useFocusEffect } from "@react-navigation/native";
import useHeaderBackground from "@/hooks/useHeaderBackground";

const NewArrivals = () => {
  const { showTabs, hideTabs } = useGlobalContext();

  useFocusEffect(
    React.useCallback(() => {
      hideTabs();
      return () => showTabs();
    }, [])
  );

  // fetch new arrivals

  const [newArrivals, setNewArrivals] = useState([]);
  const [isNewArrivalsLoading, setIsNewArrivalsLoading] = useState(false);

  const fetchNewArrivals = async () => {
    setIsNewArrivalsLoading(true);
    try {
      const res = await productService.getNewArrivals();
      setNewArrivals(res.data.data);
      setFiltredProducts(res.data.data);
    } catch (error) {
      Alert.alert("Error fetching new arrivals:", error);
    } finally {
      setIsNewArrivalsLoading(false);
    }
  };

  useEffect(() => {
    fetchNewArrivals();
  }, []);

  const [sortOption, setSortOption] = useState("newest");
  const [isPriceAsc, setIsPriceAsc] = useState(false);

  const sortProducts = (products) => {
    if (sortOption === "newest") {
      return [...products].sort(
        (a, b) => new Date(b.dateCreation) - new Date(a.dateCreation)
      );
    } else if (sortOption === "price") {
      return [...products].sort((a, b) => {
        return isPriceAsc ? a.price - b.price : b.price - a.price;
      });
    }
    return products;
  };

  const handleSortByNewest = () => {
    setSortOption("newest");
  };

  const handleSortByPrice = () => {
    setSortOption("price");
    setIsPriceAsc((prevState) => !prevState); // Toggle between ascending and descending order
  };

  // Bottom sheet
  const { isBottomSheetOpened, setIsBottomSheetOpened } = useGlobalContext();
  const bottomSheetRef = useRef(null);
  const [bottomSheetComp, setBottomSheetComp] = useState("");



  const [initialSnapPoints, setInitialSnapPoints] = useState([100, 200]);

  const openBottomSheet = (comp, snap) => {
    setBottomSheetComp(comp);
    setInitialSnapPoints(snap);
    hideTabs();
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

  // Filter state
  const [filterData, setFilterData] = useState({
    minPrice: "",
    maxPrice: "",
    maxMQO: "",
    categoryId: "",
  });

  const [filtredProducts, setFiltredProducts] = useState(newArrivals);

  const applyFilters = () => {
    const filteredProducts = newArrivals.filter((product) => {
      const { minPrice, maxPrice, maxMQO, categoryId } = filterData;

      const priceMatch =
        (minPrice ? product.price >= Number(minPrice) : true) &&
        (maxPrice ? product.price <= Number(maxPrice) : true);

      const MQOmatch = maxMQO ? product.minQuantity <= Number(maxMQO) : true;

      const categoryMatch = categoryId
        ? product.categoryId == categoryId
        : true;

      return priceMatch && MQOmatch && categoryMatch;
    });

    setFiltredProducts(filteredProducts);
    closeBottomSheet();
  };

  const resetFilters = () => {
    setFilterData({
      minPrice: "",
      maxPrice: "",
      maxMQO: "",
      categoryId: "",
    });
    setFiltredProducts(newArrivals);
  };

  return (
    <GestureHandlerRootView>
      <SafeAreaView className="bg-white h-full">
        {bottomSheetRef.current && isBottomSheetOpened && (
          <TouchableWithoutFeedback onPress={() => closeBottomSheet()}>
            <View
              className="absolute h-full w-full z-[10]"
              style={{ backgroundColor: "rgba(0, 0, 0, 0.4)" }}
            />
          </TouchableWithoutFeedback>
        )}
        <View className="flex flex-row w-full items-center px-4 pb-2 mb-3 border-b border-gray-200">
          <CustomButton
            title="filter"
            handlePress={() => openBottomSheet("filter", [590, 590])}
            containerStyles="min-h-[32px] rounded-full bg-white border-[1px] border-accent px-2"
            icon="filter-alt"
            iconColor="#496686"
            iconSize={20}
            textStyles="text-accent text-xs"
          />
          <CustomButton
            title="Newest"
            handlePress={handleSortByNewest}
            containerStyles="ml-2 min-h-[32px] rounded-full bg-white border-[1px] border-accent px-2 flex-row-reverse"
            icon="keyboard-arrow-down"
            iconColor={sortOption === "newest" ? "#496686" : "#ccc"}
            iconSize={20}
            textStyles="text-accent text-xs"
          />

          <CustomButton
            title="Price"
            handlePress={handleSortByPrice}
            containerStyles="ml-2 min-h-[32px] rounded-full bg-white border-[1px] border-accent px-2 flex-row-reverse"
            icon={isPriceAsc ? "keyboard-arrow-up" : "keyboard-arrow-down"}
            iconColor={sortOption === "price" ? "#496686" : "#ccc"}
            iconSize={20}
            textStyles="text-accent text-xs"
          />
          <CustomButton
            title="Rank"
            containerStyles="ml-2 min-h-[32px] rounded-full bg-white border-[1px] border-accent px-2 flex-row-reverse"
            icon="keyboard-arrow-down"
            iconColor="#496686"
            iconSize={20}
            textStyles="text-accent text-xs"
          />
        </View>
        <ScrollView showsVerticalScrollIndicator={false}>
          <MasonryListContainer
            data={sortProducts(filtredProducts)}
            showDate={true}
            loading={isNewArrivalsLoading}
          />
        </ScrollView>
        <BottomSheet
          ref={bottomSheetRef}
          index={-1}
          snapPoints={initialSnapPoints}
          enablePanDownToClose={true}
          onClose={() => closeBottomSheet()}
          containerStyle={{
            zIndex: 1500,
          }}
        >
          {bottomSheetComp === "filter" && (
            <View className="border-b-[1px] border-gray-lighter p-2 w-full">
              <Text className="font-pmedium text-lg text-center">Filters</Text>
            </View>
          )}
          <BottomSheetScrollView className="flex-1">
            <View className="">
              {bottomSheetComp === "filter" && (
                <View className="px-4">
                  <View className="flex justify-between flex-grow">
                    <View>
                      {/* Your filter fields go here */}
                      <View className="flex flex-row mt-1">
                        <View className="w-1/2 pr-1">
                          <FormField
                            value={filterData.minPrice}
                            title="Min Price"
                            placeholder="Min Price"
                            handleChangeText={(e) =>
                              setFilterData({ ...filterData, minPrice: e })
                            }
                            labelStyle="text-dark mb-1"
                            inputStyles="border-[1px] border-[#d5d5d5] h-12 rounded-lg focus:border-primary"
                            placeholderTextColor="#b5b5b5"
                            style={{ fontSize: 13 }}
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
                            labelStyle="text-dark mb-1"
                            inputStyles="border-[1px] border-[#d5d5d5] h-12 rounded-lg focus:border-primary"
                            placeholderTextColor="#b5b5b5"
                            style={{ fontSize: 13 }}
                            otherStyles="space-y-0 mt-2"
                            keyboardType="numeric"
                            label="DA"
                          />
                        </View>
                      </View>
                      <FormField
                        value={filterData.maxMQO}
                        title="Minimum order quantity"
                        placeholder="Less than"
                        handleChangeText={(e) =>
                          setFilterData({ ...filterData, maxMQO: e })
                        }
                        labelStyle="text-dark mb-1"
                        inputStyles="border-[1px] border-[#d5d5d5] h-12 rounded-lg focus:border-primary"
                        placeholderTextColor="#b5b5b5"
                        style={{ fontSize: 13 }}
                        otherStyles="space-y-0 mt-4"
                        keyboardType="numeric"
                      />
                      <CustomSelectDropDown
                        data={categories.data.map((cat) => ({
                          label: cat.name,
                          value: cat.id,
                        }))}
                        title="Category"
                        labelStyle="text-dark mb-1"
                        placeholder="Category"
                        containerStyles="mt-4"
                        handleOnValueChange={(e) => {
                          setFilterData({
                            ...filterData,
                            categoryId: e,
                          });
                        }}
                      />
                    </View>
                  </View>
                </View>
              )}
            </View>
          </BottomSheetScrollView>

          {/* Fixed buttons at the bottom */}
          <View className="p-4 border-t border-gray-200 bg-white">
            <CustomButton
              title="Show results"
              handlePress={applyFilters}
              containerStyles="w-full rounded-full bg-secondary min-h-[42px]"
              textStyles="text-white text-[16px]"
            />
            <CustomButton
              title="Clear all"
              handlePress={resetFilters}
              containerStyles="w-full mt-2 rounded-full bg-white border border-accent min-h-[42px]"
              textStyles="text-accent text-[16px]"
            />
          </View>
        </BottomSheet>
      </SafeAreaView>
      <StatusBar
        backgroundColor={isBottomSheetOpened ? "rgba(0, 0, 0, 0.001)" : "#fff"}
        barStyle="dark-content"
      />
    </GestureHandlerRootView>
  );
};

export default NewArrivals;
