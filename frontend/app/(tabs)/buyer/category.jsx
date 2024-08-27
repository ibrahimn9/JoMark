import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  Image,
  FlatList,
  Dimensions,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useState, useEffect } from "react";
import categories from "@/constants/categories";
import { MasonryListContainer } from "@/containers";
import productService from "../../../services/product";

const { width } = Dimensions.get("window");

const ITEMS_PER_PAGE = 6; // Number of categories per page

const CategoryScreen = () => {
  const [currentPage, setCurrentPage] = useState(0);

  const totalPages = Math.ceil(categories.data.length / ITEMS_PER_PAGE);

  const handlePageChange = (pageIndex) => {
    setCurrentPage(pageIndex);
  };

  const [selectedCategory, setSelectedCategory] = useState();

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

  // fetch Product by category

  const fetchByCategory = async () => {
    setIsProdutsLoading(true);
    try {
      const res = await productService.getProductByCategory(selectedCategory);
      setProducts(res.data.data);
    } catch (error) {
      Alert.alert("Error fetching products:", error);
    } finally {
      setIsProdutsLoading(false);
    }
  };

  useEffect(() => {
    if (selectedCategory) fetchByCategory();
    else fetchProducts();
  }, [selectedCategory]);

  const renderCategory = ({ item }) => (
    <TouchableOpacity
      onPress={() => {
        item.id === selectedCategory
          ? setSelectedCategory("")
          : setSelectedCategory(item.id);
      }}
      className="mt-2 flex items-center"
      style={{ width: width / 3 }}
    >
      <View
        className={`p-2 rounded-full justify-center items-center bg-gray-200 overflow-hidden ${
          item.id === selectedCategory ? "border-[2px] border-dark" : ""
        }`}
      >
        <Image
          className="w-[35px] h-[35px]"
          source={{
            uri: `${item.icon.slice(0, -6)}435160`,
          }}
          resizeMode="contain"
        />
      </View>
      <Text
        numberOfLines={2}
        className="max-w-[65px] font-pregular mt-1 text-center"
      >
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  const getPaginatedData = () => {
    const startIndex = currentPage * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return categories.data.slice(startIndex, endIndex);
  };

  return (
    <SafeAreaView className="h-full bg-white pt-6">
      <View className="mt-4 px-0">
        <Text className="font-pmedium text-dark text-lg mb-4 px-4">
          All Categories
        </Text>
        <FlatList
          data={getPaginatedData()}
          renderItem={renderCategory}
          keyExtractor={(item, index) => index.toString()}
          numColumns={3}
          contentContainerStyle={{
            paddingBottom: 4,
            display: "flex",
            alignItems: "center",
          }}
          className="max-h-[220px] min-h-[220px]"
          scrollEnabled={false} 
        />

        {/* Pagination Dots */}
        <View className="flex flex-row justify-center mb-4">
          {Array.from({ length: totalPages }, (_, i) => (
            <TouchableOpacity
              key={i}
              onPress={() => handlePageChange(i)}
              className={`mx-1 h-3 w-3 rounded-full ${
                i === currentPage ? "bg-accent" : "bg-gray-300"
              }`}
            />
          ))}
        </View>
        <ScrollView showsVerticalScrollIndicator={false} className="px-0">
          <MasonryListContainer data={products} loading={isProdutsLoading} />
        </ScrollView>
      </View>
      <StatusBar backgroundColor="#fff" />
    </SafeAreaView>
  );
};

export default CategoryScreen;
