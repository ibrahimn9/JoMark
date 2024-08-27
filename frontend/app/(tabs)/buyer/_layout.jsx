import { View, Text } from "react-native";
import React from "react";
import { Stack, Tabs } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useGlobalContext } from "@/context/GlobalProvider";
import dictionary from "@/constants/dictionary.json";

const TabIcon = ({ icon, color, name, focused }) => {
  return (
    <View className="flex items-center justify-center">
      <MaterialCommunityIcons
        name={focused ? icon : `${icon}-outline`}
        size={24}
        color={color}
      />
      <Text
        className={`${focused ? "font-psemibold" : "font-pregular"} text-xs`}
        style={{ color: color }}
      >
        {name}
      </Text>
    </View>
  );
};

const BuyerLayout = () => {
  const {
    selectedLang,
    areTabsVisible,
    isBottomSheetOpened,
    setIsBottomSheetOpened,
  } = useGlobalContext();
  const selectedDict = dictionary.tabElements[selectedLang];
  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: "#fd7014",
          tabBarInactiveTintColor: "#435160",
          tabBarShowLabel: false,
          tabBarStyle: {
            backgroundColor: "#fff",
            height: areTabsVisible ? 58 : 0,
            shadowColor: "none",
            borderWidth: 0,
            zIndex: 1,
          },
        }}
      >
        <Tabs.Screen
          name="(home)"
          options={{
            title: "Home",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon="rhombus"
                color={color}
                name={selectedDict.home}
                focused={focused}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="category"
          options={{
            title: "Category",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon="layers"
                color={color}
                name="Category"
                focused={focused}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="message"
          options={{
            title: "Messages",
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon="message-processing"
                color={color}
                name="Messages"
                focused={focused}
              />
            ),
            headerShown: false,
          }}
        />
        <Tabs.Screen
          name="cart"
          options={{
            title: "Cart",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon="cart"
                color={color}
                name="Cart"
                focused={focused}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="account"
          options={{
            title: "Account",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon="account"
                color={color}
                name="Account"
                focused={focused}
              />
            ),
          }}
        />
      </Tabs>

      <StatusBar backgroundColor="#fd7014" style="dark" />
    </>
  );
};

export default BuyerLayout;
