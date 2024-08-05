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

const SellerLayout = () => {
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
            height: !isBottomSheetOpened && areTabsVisible ? 58 : 0,
            shadowColor: "none",
            borderWidth: 0,
            zIndex: 1,
          },
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: "Home",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon="view-dashboard"
                color={color}
                name={selectedDict.home}
                focused={focused}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="(store)"
          options={{
            title: "Store",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon="store"
                color={color}
                name={selectedDict.store}
                focused={focused}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="(product)"
          options={{
            title: "Product",
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon="cube"
                color={color}
                name={selectedDict.product}
                focused={focused}
              />
            ),
            headerShown: false,
          }}
        />
        <Tabs.Screen
          name="orders"
          options={{
            title: "Orders",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon="clipboard-text-multiple"
                color={color}
                name={selectedDict.orders}
                focused={focused}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="messages"
          options={{
            title: "Messages",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon="message-processing"
                color={color}
                name={selectedDict.messages}
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

export default SellerLayout;
