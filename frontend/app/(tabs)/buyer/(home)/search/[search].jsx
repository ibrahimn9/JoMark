import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
  Alert,
} from "react-native";
import React, { useState, useEffect } from "react";
import { MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import { SearchInput } from "@/components";
import productService from "@/services/product";
import { MasonryListContainer } from "@/containers";
import { useFocusEffect } from "@react-navigation/native";
import { useGlobalContext } from "@/context/GlobalProvider";
import { useLocalSearchParams, useNavigation, router } from "expo-router";

const SearchResult = () => {
  const { showTabs, hideTabs } = useGlobalContext();
  const navigation = useNavigation();

  useFocusEffect(
    React.useCallback(() => {
      hideTabs();
      return () => showTabs();
    }, [])
  );

  const [isLoading, setIsLoading] = useState(false);

  const [products, setProducts] = useState([]);

  const searchForProduct = async (searchText) => {
    setIsLoading(true);
    try {
      const res = await productService.getProductBySearch(searchText);
      console.log(res.data);
      setProducts(res.data.data);
    } catch (error) {
      Alert.alert("Error fetching search result:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const { search } = useLocalSearchParams();

  useEffect(() => {
    if (search) searchForProduct(search);
  }, []);

  return (
    <SafeAreaView className="h-full w-full pt-12 bg-white">
      <View className="w-full px-4 flex-row items-center py-1">
        <TouchableOpacity className="mr-4" onPress={() => router.back()}>
          <Feather name="chevron-left" size={28} color="#253444" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => router.back()}
          className="h-10 px-4 rounded-full bg-gray-200 flex-1 flex-row items-center"
        >
          <Text className="text-dark font-pmedium">{search}</Text>
        </TouchableOpacity>
      </View>
      <View className="mt-4 h-full">
        <MasonryListContainer data={products} loading={isLoading} />
      </View>
      <View className="bg-white w-[150px] h-[150px] mt-4" />
    </SafeAreaView>
  );
};

export default SearchResult;
