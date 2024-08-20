import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Dimensions,
} from "react-native";

const tabs = ["Products", "Discover Stores", "Brands"];

const Navigation = ({ selectedTab, setSelectedTab }) => {
  const underlineAnim = useRef(new Animated.Value(0)).current;
  const screenWidth = Dimensions.get("window").width;

  const handleTabPress = (index) => {
    setSelectedTab(tabs[index]);
    Animated.spring(underlineAnim, {
      toValue: 0,
      useNativeDriver: false,
    }).start();
  };

  return (
    <View>
      <View
        className="flex-row items-center my-5"
        style={{ width: screenWidth }}
      >
        {tabs.map((tab, index) => (
          <TouchableOpacity key={index} onPress={() => handleTabPress(index)}>
            <View className="items-center pb-2 mr-4">
              <Text
                style={{
                  fontSize: selectedTab === tab ? 18 : 16,
                  color: "#fff",
                }}
                className="font-pmedium"
              >
                {tab}
              </Text>
              <Animated.View
                style={{
                  height: 3,
                  width: 50,
                  backgroundColor: selectedTab === tab ? "#fff" : "transparent",
                  position: "absolute",
                  bottom: 0,
                  transform: [{ translateX: underlineAnim }],
                }}
                className="rounded-full"
              />
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default Navigation;
