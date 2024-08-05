import { View, Text, Image } from "react-native";
import React from "react";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useGlobalContext } from "@/context/GlobalProvider";
import categories from "@/constants/categories";

const StoreAbout = () => {
  const { userData } = useGlobalContext();
  const storeData = userData.store;

  console.log(userData.email);
  return (
    <View className="mt-1 px-4">
      <View>
        <Text className="font-pmedium text-lg text-dark-light">Address</Text>
        {storeData.address && (
          <View className="flex flex-row items-center">
            <MaterialCommunityIcons
              name="map-marker"
              size={24}
              color="#435160"
            />
            <Text className="ml-2 font-pregular mt-1">{storeData.address}</Text>
          </View>
        )}
      </View>
      <View className="mt-4">
        <Text className="font-pmedium text-lg text-dark-light">Contact</Text>
        {userData.phoneNumber && (
          <View className="flex flex-row items-center">
            <MaterialIcons name="phone-enabled" size={24} color="#435160" />
            <Text className="ml-2 font-pregular mt-1">
              {userData.phoneNumber}
            </Text>
          </View>
        )}
        {userData.email && (
          <View className="flex flex-row items-center">
            <MaterialCommunityIcons name="email" size={24} color="#435160" />
            <Text className="ml-2 font-pregular mt-1">{userData.email}</Text>
          </View>
        )}
      </View>
      <View className="mt-4">
        <Text className="font-pmedium text-lg text-dark-light">
          Business Hours
        </Text>
        {storeData.start && (
          <View className="flex flex-row items-center">
            <MaterialCommunityIcons name="clock" size={24} color="#435160" />
            <Text className="ml-2 font-pregular mt-1">
              {storeData.start} - {storeData.end}
            </Text>
          </View>
        )}
      </View>
      <View className="mt-4">
        <Text className="font-pmedium text-lg text-dark-light">Category</Text>
        <View className="flex flex-row items-center flex-wrap gap-x-1 mt-1">
          {categories.data
            .filter((cat) => storeData.categories.includes(cat.id))
            .map((cat, index) => (
              <View
                key={index}
                className="border border-dark-light p-1 rounded-md bg-gray-lightest mt-2"
              >
                <Image
                  className="w-6 h-6"
                  source={{
                    uri: `${cat.icon.slice(0, -6)}435160`,
                  }}
                />
              </View>
            ))}
        </View>
      </View>
    </View>
  );
};

export default StoreAbout;
