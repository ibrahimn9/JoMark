import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View, TouchableOpacity, Text } from "react-native";
import { MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { useGlobalContext } from "@/context/GlobalProvider";

const DetailsLayout = () => {
  const [isOpened, setIsOpened] = useState(false);
  const { areTabsVisible, isBottomSheetOpened } = useGlobalContext();
  return (
    <>
      <Stack>
        <Stack.Screen
          name="[id]"
          options={{
            headerTransparent: true,
            headerRight: () => (
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <TouchableOpacity
                  className="rounded-full p-1 bg-[#25344475]"
                  style={{ marginLeft: 16 }}
                >
                  <MaterialCommunityIcons
                    name="cards-heart-outline"
                    size={18}
                    color="white"
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    router.push("/buyer/cart");
                  }}
                  className="rounded-full p-1 bg-[#25344475]"
                  style={{ marginLeft: 16 }}
                >
                  <MaterialCommunityIcons
                    name="cart-outline"
                    size={18}
                    color="white"
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setIsOpened(!isOpened)}
                  className="rounded-full p-1 bg-[#25344475]"
                  style={{ marginLeft: 16 }}
                >
                  <MaterialCommunityIcons
                    name="dots-horizontal"
                    size={18}
                    color="white"
                  />
                </TouchableOpacity>
              </View>
            ),
            headerLeft: ({ canGoBack }) =>
              canGoBack ? (
                <TouchableOpacity
                  className="rounded-full p-1 bg-[#25344475]"
                  onPress={() => router.back()}
                >
                  <Feather name="chevron-left" size={18} color="white" />
                </TouchableOpacity>
              ) : null,
            headerTitle: "",
            headerStyle: {
              backgroundColor: isBottomSheetOpened
                ? "rgba(0, 0, 0, 0.38)"
                : "#fff",
            },
          }}
        />
      </Stack>
      {isOpened && (
        <TouchableOpacity
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 1199,
          }}
          activeOpacity={1}
          onPress={() => setIsOpened(false)}
        >
          <View />
        </TouchableOpacity>
      )}
      {isOpened && (
        <View className="absolute right-[8px] top-[88px] z-[1200]">
          <View
            style={{
              position: "absolute",
              top: -7,
              height: 0,
              right: 10,
              borderLeftWidth: 10,
              borderRightWidth: 10,
              borderBottomWidth: 10,
              borderLeftColor: "transparent",
              borderRightColor: "transparent",
              borderBottomColor: "#202020",
            }}
          />

          <View className="bg-[#202020] rounded-lg py-2 px-4 w-[155px]">
            <TouchableOpacity
              onPress={() => router.replace("buyer/home")}
              className="flex flex-row items-center"
            >
              <Feather name="home" size={18} color="white" />
              <Text className="text-white font-pregular mt-1 ml-2">Home</Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex flex-row items-center mt-3">
              <Feather name="search" size={18} color="white" />
              <Text className="text-white font-pregular mt-1 ml-2">Search</Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex flex-row items-center mt-3">
              <Feather name="share-2" size={18} color="white" />
              <Text className="text-white font-pregular mt-1 ml-2">Share</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </>
  );
};

export default DetailsLayout;
