import React, { useState, useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  Text,
  Image,
  ActivityIndicator,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import storeService from "@/services/store";
import haversine from "haversine"; // Use haversine to calculate distance
import StoreListContainer from "./StoreListContainer";
import BottomSheet, {
  BottomSheetView,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import {
  GestureHandlerRootView,
  PanGestureHandler,
} from "react-native-gesture-handler";
import { useGlobalContext } from "@/context/GlobalProvider";
import categories from "../constants/categories.json";
import StarRating from "../components/StarRating";
import { CustomButton, CustomSelectDropDown, FormField } from "@/components";

const DiscoverContainer = () => {
  const [stores, setStores] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [storeList, setStoreList] = useState([]);

  // Fetch stores data
  const fetchStores = async () => {
    const res = await storeService.getStores();
    setStores(res.data.data);
    setFilteredStores(res.data.data);
  };

  // Get user's location
  const getUserLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      console.log("Permission to access location was denied");
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    setUserLocation({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.05,
      longitudeDelta: 0.05,
    });
  };

  const calculateDistance = (storeLocation) => {
    if (!userLocation) return null;

    const userCoords = {
      latitude: userLocation.latitude,
      longitude: userLocation.longitude,
    };

    return haversine(userCoords, storeLocation, { unit: "meter" });
  };

  const prepareStoreList = (stores) => {
    const list = stores.map((store) => {
      const distance = calculateDistance({
        latitude: store.latitude,
        longitude: store.longitude,
      });

      return {
        id: store.id,
        storePic: store.picture,
        name: store.name,
        distance: distance ? distance : null, // Store the distance in meters for sorting
        distanceDisplay: distance
          ? `${(distance / 1000).toFixed(2)} km`
          : "N/A", // For display purposes
        categories: store.categories, // Assuming store.categories contains a list of categories
      };
    });

    // Sort by distance (closest first)
    const sortedList = list.sort((a, b) => {
      if (a.distance === null) return 1;
      if (b.distance === null) return -1;
      return a.distance - b.distance;
    });

    setStoreList(sortedList);
  };

  useEffect(() => {
    if (stores.length > 0 && userLocation) {
      prepareStoreList(stores);
    }
  }, [stores, userLocation]);

  useEffect(() => {
    fetchStores();
    getUserLocation();
  }, []);

  const tabs = ["Map View", "List View"];
  const [selectedtab, setSelectedtab] = useState("Map View");

  // Bottom sheet
  const { isBottomSheetOpened, setIsBottomSheetOpened, hideTabs, showTabs } =
    useGlobalContext();
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
    showTabs();
    if (bottomSheetRef.current) {
      bottomSheetRef.current.close();
    }
  };

  const [selectedStore, setSelectedStore] = useState({});
  const [loading, setLoading] = useState(true);

  //filter
  const [filterData, setFilterData] = useState({
    maxDistance: "",
    categoryId: "",
  });

  const [filteredStores, setFilteredStores] = useState([]);

  const applyFilters = () => {
    const filteredStores = stores.filter((store) => {
      const { maxDistance, categoryId } = filterData;

      const distanceMatch = maxDistance
        ? Number(maxDistance) >=
          storeList.find((st) => st.id === store.id)?.distance / 1000
        : true;

      const categoryMatch = categoryId
        ? store.categories.includes(categoryId)
        : true;

      return distanceMatch && categoryMatch;
    });

    setFilteredStores(filteredStores);
    prepareStoreList(filteredStores);
    closeBottomSheet();
  };

  const resetFilters = () => {
    setFilterData({
      maxDistance: "",
      categoryId: "",
    });
    setFilteredStores(stores);
    prepareStoreList(stores);
  };

  return (
    <GestureHandlerRootView>
      <View className="flex-1 bg-white">
        <View className="w-full flex-row items-center py-2 bg-white px-4 justify-between">
          <View className="flex-row items-center">
            <Text
              className={`font-pregular text-sm pb-2 ${
                selectedtab === "Map View"
                  ? "text-md text-dark font-pmedium border-b-2 border-dark pb-2"
                  : ""
              }`}
              onPress={() => setSelectedtab(tabs[0])}
            >
              Map View
            </Text>
            <Text
              className={`ml-6 font-pregular text-sm pb-2 ${
                selectedtab === "List View"
                  ? "text-md text-dark font-pmedium border-b-2 border-dark pb-2"
                  : ""
              }`}
              onPress={() => setSelectedtab(tabs[1])}
            >
              List View
            </Text>
          </View>
          <CustomButton
            title="filter"
            handlePress={() => openBottomSheet("filter", [350, 350])}
            containerStyles="min-h-[32px] rounded-full bg-white border-[1px] border-accent px-2"
            icon="filter-alt"
            iconColor="#496686"
            iconSize={20}
            textStyles="text-accent text-xs"
          />
        </View>
        {selectedtab === "Map View" && userLocation && (
          <MapView
            style={styles.map}
            initialRegion={userLocation}
            showsUserLocation={true}
          >
            {filteredStores.map((store, index) => (
              <Marker
                key={index}
                coordinate={{
                  latitude: store.latitude,
                  longitude: store.longitude,
                }}
                title={store.name}
                description={store.description}
                onPress={() => {
                  setSelectedStore(storeList.find((st) => st.id === store.id));
                  openBottomSheet("store", [250, 250]);
                }}
              />
            ))}
          </MapView>
        )}
        {selectedtab === "List View" && <StoreListContainer data={storeList} />}
        <BottomSheet
          ref={bottomSheetRef}
          index={-1}
          snapPoints={initialSnapPoints}
          enablePanDownToClose={true}
          onClose={() => closeBottomSheet()}
          containerStyle={{
            zIndex: 12000,
          }}
        >
          {bottomSheetComp === "filter" && (
            <View className="border-b-[1px] border-gray-lighter p-2 w-full">
              <Text className="font-pmedium text-lg text-center">Filters</Text>
            </View>
          )}
          {bottomSheetComp === "store" && (
            <View className="flex-1 px-4">
              <View className="flex-row">
                {selectedStore.storePic ? (
                  <View className="rounded-full border-[2px] border-accent w-[65px] h-[65px] bg-gray-200 justify-center items-center overflow-hidden">
                    <Image
                      source={{ uri: selectedStore.storePic }}
                      className="rounded-md w-full h-[165px]"
                      onLoad={() => setLoading(false)}
                      onError={() => setLoading(false)}
                      resizeMode="contain"
                    />
                    {loading && (
                      <ActivityIndicator
                        size="small"
                        color="#ffffff"
                        style={{ position: "absolute" }}
                      />
                    )}
                  </View>
                ) : (
                  <View className="rounded-full w-[65px] h-[65px] border-[2px] border-accent bg-gray-200 justify-center items-center">
                    <Text className="text-gray-700">No Image</Text>
                  </View>
                )}
                <View className="ml-4">
                  <Text className="text-lg text-primary font-pbold mt-1">
                    {selectedStore.name}
                  </Text>
                  <View className="flex-row items-center mt-1">
                    <StarRating rating={4.7} size={14} color="#fd7014" />
                    <Text className="text-xs font-pregular ml-1">
                      4.7 (63 reviews)
                    </Text>
                  </View>
                </View>
              </View>
              <View className="mt-4 px-1">
                <Text className="mt-1 text-md font-pregular">
                  Distance: {selectedStore.distanceDisplay}
                </Text>
                <Text className="mt-1 text-md font-pregular">
                  Category:{"  "}
                  {categories.data
                    .filter((cat) => selectedStore.categories?.includes(cat.id))
                    .map((cat) => cat.name)
                    .join(" , ")}
                </Text>
              </View>
              <View className="pt-6 bg-white">
                <CustomButton
                  title="Visit Store"
                  containerStyles="px-6 flex-1 rounded-full bg-secondary min-h-[42px]"
                  textStyles="text-white text-[16px]"
                />
              </View>
            </View>
          )}
          {bottomSheetComp === "filter" && (
            <View className="px-4">
              <View className="flex justify-between flex-grow">
                <View>
                  {/* Your filter fields go here */}

                  <FormField
                    value={filterData.maxDistance}
                    title="Max Distance"
                    placeholder="Max Distance"
                    handleChangeText={(e) =>
                      setFilterData({ ...filterData, maxDistance: e })
                    }
                    labelStyle="text-dark mb-1"
                    inputStyles="border-[1px] border-[#d5d5d5] h-12 rounded-lg focus:border-primary"
                    placeholderTextColor="#b5b5b5"
                    style={{ fontSize: 13 }}
                    otherStyles="space-y-0 mt-2"
                    keyboardType="numeric"
                    label="Km"
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
              <View className="mt-6 flex-row items-center justify-between bg-white">
                <CustomButton
                  title="Clear all"
                  handlePress={resetFilters}
                  containerStyles="w-[48%] rounded-full bg-white border border-accent min-h-[42px]"
                  textStyles="text-accent text-[16px]"
                />
                <CustomButton
                  title="Show results"
                  handlePress={applyFilters}
                  containerStyles="w-[48%] rounded-full bg-secondary min-h-[42px]"
                  textStyles="text-white text-[16px]"
                />
              </View>
            </View>
          )}
        </BottomSheet>
      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
    height: Dimensions.get("window").height * 0.688, // Adjust the height as needed
    width: "100%",
  },
});

export default DiscoverContainer;
