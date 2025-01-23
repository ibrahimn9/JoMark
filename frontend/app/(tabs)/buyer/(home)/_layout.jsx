import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View, TouchableOpacity, Text } from "react-native";
import { MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { useGlobalContext } from "@/context/GlobalProvider";

const StoreLayout = () => {
  const { areTabsVisible, isBottomSheetOpened } = useGlobalContext();

  return (
    <>
      <Stack>
        <Stack.Screen
          name="home"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="new-arrivals"
          options={{
            headerTitle: "New Arrivals",
            headerShadowVisible: false,
            headerTitleStyle: {
              fontFamily: "Poppins-Medium",
            },
            headerStyle: {
              backgroundColor: isBottomSheetOpened
                ? "rgba(0, 0, 0, 0.38)"
                : "#fff",
            },
          }}
        />
        <Stack.Screen
          name="details"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="search"
          options={{
            headerShown: false
          }}
        />
      </Stack>
      <StatusBar style="light" />
    </>
  );
};

export default StoreLayout;
