import React, { useState, useEffect } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import storeService from "@/services/store";
import haversine from "haversine"; // Use haversine to calculate distance

const DiscoverContainer = () => {
  const [stores, setStores] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [storeList, setStoreList] = useState([]);

  // Fetch stores data
  const fetchStores = async () => {
    const res = await storeService.getStores();
    setStores(res.data.data);
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

  const prepareStoreList = () => {
    const list = stores.map((store) => {
      const distance = calculateDistance({
        latitude: store.latitude,
        longitude: store.longitude,
      });

      return {
        storePic: store.picture, // Assuming store.picture contains the store's picture URL
        name: store.name,
        distance: distance ? `${(distance / 1000).toFixed(2)} km` : "N/A",
        categories: store.categories, // Assuming store.categories contains a list of categories
      };
    });

    setStoreList(list);
  };

  useEffect(() => {
    if (stores.length > 0 && userLocation) {
      prepareStoreList();
    }
  }, [stores, userLocation]);

  useEffect(() => {
    fetchStores();
    getUserLocation();
  }, []);

  const tabs = ["Maps View", "List View"];
  const [selectedtab, setSelectedtab] = useState("Map View");

  return (
    <View style={styles.container}>
      <View className="w-full flex-row items-center">
        
      </View>
      {userLocation && (
        <MapView
          style={styles.map}
          initialRegion={userLocation}
          showsUserLocation={true}
        >
          {stores.map((store, index) => (
            <Marker
              key={index}
              coordinate={{
                latitude: store.latitude,
                longitude: store.longitude,
              }}
              title={store.name}
              description={store.description}
            />
          ))}
        </MapView>
      )}
      {/* You can now use storeList wherever needed */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
    height: Dimensions.get("window").height * 0.6, // Adjust the height as needed
    width: "100%",
  },
});

export default DiscoverContainer;
