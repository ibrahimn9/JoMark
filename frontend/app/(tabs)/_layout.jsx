import { View, Text } from "react-native";
import React from "react";
import { Stack } from "expo-router";
import { useGlobalContext } from "@/context/GlobalProvider";

const TabsLayout = () => {
  const { hide, setHide } = useGlobalContext();

  return (
    <Stack>
      <Stack.Screen name="seller" options={{ headerShown: false }} />
      <Stack.Screen name="buyer" options={{ headerShown: false }} />
    </Stack>
  );
};

export default TabsLayout;
