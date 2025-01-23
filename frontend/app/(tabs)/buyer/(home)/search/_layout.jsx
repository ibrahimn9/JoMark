import { View, Text } from "react-native";
import { Redirect, Stack } from "expo-router";
import React from "react";

const SearchLayout = () => {
  return (
    <Stack>
      <Stack.Screen
        name="search-result"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="[search]"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
};

export default SearchLayout;
