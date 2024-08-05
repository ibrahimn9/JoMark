import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  Button,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { useGlobalContext } from "@/context/GlobalProvider";

const BusinessAddressInput = ({
  storeData,
  editObj,
  setEditObj,
  otherStyles,
}) => {
  const [isMapVisible, setIsMapVisible] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const { selectedLang } = useGlobalContext();

  const handleSelectLocation = async (event) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setSelectedLocation({ latitude, longitude });

    let reverseGeocode = await Location.reverseGeocodeAsync({
      latitude,
      longitude,
    });

    if (reverseGeocode.length > 0) {
      const { city, country } = reverseGeocode[0];
      const address = `${city}, ${country}`;
      setEditObj({
        ...editObj,
        address: address,
        latitude,
        longitude,
      });
    }
    setIsMapVisible(false);
  };

  const showMap = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      console.log("Permission to access location was denied");
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    setSelectedLocation({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    });
    setIsMapVisible(true);
  };

  return (
    <View
      className={`border-t border-gray-lighter py-2 px-4 mt-[2px] ${otherStyles}`}
    >
      <View className="flex flex-row items-center justify-between">
        <Text className="font-pmedium text-lg text-dark-light">Address</Text>
        <TouchableOpacity onPress={showMap}>
          <Text className="font-pregular text-lg text-secondary">
            {storeData?.address || editObj?.address ? "Edit" : "Add"}
          </Text>
        </TouchableOpacity>
      </View>
      {Object.keys(editObj).find((k) => k === "address") ? (
        <TextInput
          value={editObj.address}
          placeholder="Enter your address..."
          onChangeText={(e) => setEditObj({ ...editObj, address: e })}
          className="font-pmedium my-1"
          autoFocus={true}
          style={selectedLang === "AR" && { textAlign: "right" }}
        />
      ) : (
        storeData?.address && (
          <Text className="text-center text-primary-light font-pregular text-base">
            {storeData.address}
          </Text>
        )
      )}

      <Modal
        visible={isMapVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsMapVisible(false)}
      >
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <MapView
            style={{ width: "100%", height: "80%" }}
            initialRegion={{
              latitude: selectedLocation?.latitude || 28.0339,
              longitude: selectedLocation?.longitude || 1.6596,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
            onPress={handleSelectLocation}
          >
            {selectedLocation && <Marker coordinate={selectedLocation} />}
          </MapView>
          <Button title="Close" onPress={() => setIsMapVisible(false)} />
        </View>
      </Modal>
    </View>
  );
};

export default BusinessAddressInput;
