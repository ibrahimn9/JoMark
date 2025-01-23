import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
  Alert,
} from "react-native";
import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import { SearchInput } from "@/components";
import productService from "@/services/product";
import { MasonryListContainer } from "@/containers";
import { useFocusEffect } from "@react-navigation/native";
import { useGlobalContext } from "@/context/GlobalProvider";
import { useLocalSearchParams, useNavigation, router } from "expo-router";

const RECENT_SEARCH_KEY = "recent_searches";

const SearchScreen = () => {
  const { showTabs, hideTabs } = useGlobalContext();
  const navigation = useNavigation();

  useFocusEffect(
    React.useCallback(() => {
      hideTabs();
      return () => showTabs();
    }, [])
  );

  const [searchText, setSearchText] = useState("");
  const [recentSearches, setRecentSearches] = useState([]);
  const [showAllRecentSearches, setShowAllRecentSearches] = useState(false);
  const [matchingWords, setMatchingWords] = useState([]);

  const handleClearSearch = () => {
    setSearchText("");
  };

  const fetchSuggestion = async () => {
    try {
      const res = await productService.getSuggestion(searchText);
      // Use Set to remove duplicates and then convert it back to an array
      const uniqueMatchingWords = [
        ...new Set(res.data.data.map((word) => word.MatchingWord)),
      ];
      setMatchingWords(uniqueMatchingWords);
    } catch (error) {
      Alert.alert("Error fetching matching words:", error);
    }
  };

  const saveRecentSearch = async (text) => {
    try {
      let searches = await AsyncStorage.getItem(RECENT_SEARCH_KEY);
      searches = searches ? JSON.parse(searches) : [];

      // Prevent duplicates and limit recent searches to 10
      if (!searches.includes(text)) {
        searches = [text, ...searches].slice(0, 10);
        await AsyncStorage.setItem(RECENT_SEARCH_KEY, JSON.stringify(searches));
        setRecentSearches(searches);
      }
    } catch (error) {
      console.log("Error saving recent search:", error);
    }
  };

  const loadRecentSearches = async () => {
    try {
      const searches = await AsyncStorage.getItem(RECENT_SEARCH_KEY);
      if (searches) {
        setRecentSearches(JSON.parse(searches));
      }
    } catch (error) {
      console.log("Error loading recent searches:", error);
    }
  };

  const clearRecentSearches = async () => {
    try {
      await AsyncStorage.removeItem(RECENT_SEARCH_KEY);
      setRecentSearches([]);
    } catch (error) {
      console.log("Error clearing recent searches:", error);
    }
  };

  useEffect(() => {
    loadRecentSearches();
  }, []);

  useEffect(() => {
    if (searchText) fetchSuggestion();
    else setMatchingWords([]);
  }, [searchText]);

  return (
    <SafeAreaView className="h-full pt-12 bg-white">
      <View className="w-full px-4 flex-row items-center py-1">
        <TouchableOpacity className="mr-4" onPress={() => router.back()}>
          <Feather name="chevron-left" size={28} color="#253444" />
        </TouchableOpacity>
        <SearchInput
          inputStyles="flex-1"
          placeholder="Find what you need..."
          value={searchText}
          placeholderTextColor="#25344475"
          handleClearSearch={handleClearSearch}
          handleChangeText={(e) => setSearchText(e)}
          handleSearch={() => {
            saveRecentSearch(searchText);
            router.push(`/buyer/search/${searchText}`);
          }}
        />
      </View>

      {/* Recent Searches */}
      {!matchingWords.length && (
        <View className="mt-2 w-full px-4">
          {recentSearches.length > 0 && (
            <>
              <View className="flex-row justify-between items-center">
                <Text className="text-dark text-base font-psemibold">
                  Recent Searches
                </Text>
                <TouchableOpacity onPress={clearRecentSearches}>
                  <MaterialCommunityIcons
                    name="delete-outline"
                    size={22}
                    color="gray"
                  />
                </TouchableOpacity>
              </View>
              {recentSearches
                .slice(0, showAllRecentSearches ? recentSearches.length : 3)
                .map((search, index) => (
                  <View
                    key={index}
                    className="flex-row justify-between items-center border-b border-gray-200 py-3"
                  >
                    <Text className="font-pregular">{search}</Text>
                    <TouchableOpacity onPress={() => setSearchText(search)}>
                      <Feather name="arrow-up-left" size={22} color="black" />
                    </TouchableOpacity>
                  </View>
                ))}
              {recentSearches.length > 3 && (
                <TouchableOpacity
                  className="mt-2 py-2 flex-row items-center"
                  onPress={() =>
                    setShowAllRecentSearches(!showAllRecentSearches)
                  }
                >
                  <Text className="text-accent font-pmedium mr-2 mt-1">
                    More
                  </Text>
                  <Feather
                    name={showAllRecentSearches ? "chevron-up" : "chevron-down"}
                    size={18}
                    color="#496686"
                  />
                </TouchableOpacity>
              )}
            </>
          )}
        </View>
      )}

      {/* Matching Words */}
      <View className="mt-2 w-full">
        {matchingWords.map((word, index) => {
          const matchingPart = word.substring(0, searchText.length);
          const remainingPart = word.substring(searchText.length);

          return (
            <View
              key={index}
              className="flex-row justify-between items-center border-b border-gray-200 p-4"
            >
              <Text className="font-pregular">
                {/* Matching part with black color */}
                <Text style={{ color: "black" }}>{matchingPart}</Text>
                {/* Remaining part with gray color */}
                <Text style={{ color: "gray" }}>{remainingPart}</Text>
              </Text>
              <TouchableOpacity onPress={() => setSearchText(word)}>
                <Feather name="arrow-up-left" size={22} color="black" />
              </TouchableOpacity>
            </View>
          );
        })}
      </View>

      <StatusBar backgroundColor="white" barStyle="dark-content" />
    </SafeAreaView>
  );
};

export default SearchScreen;
