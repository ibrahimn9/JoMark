import {
  View,
  Text,
  Image,
  ActivityIndicator,
  TouchableWithoutFeedback,
} from "react-native";
import React, { useState } from "react";
import images from "@/constants/images";
import { router } from "expo-router";

const SectionProduct = ({ item }) => {
  const [loading, setLoading] = useState(true);

  return (
    <TouchableWithoutFeedback
      onPress={() => router.push(`/buyer/details/${item.id}`)}
    >
      <View className="mr-1">
        {item.imageUrl ? (
          <View className="rounded-md w-[105px] h-[110] bg-gray-200 justify-center items-center overflow-hidden">
            <Image
              source={{ uri: item.imageUrl }}
              className="rounded-md w-full h-[165px]"
              onLoad={() => setLoading(false)}
              onError={() => setLoading(false)}
              resizeMode="cover"
            />
            {loading && (
              <ActivityIndicator
                size="small"
                color="#ffffff"
                style={{ position: "absolute" }}
              />
            )}
          </View>
        ) : (
          <View className="rounded-md w-[105px] h-[110px] bg-gray-200 justify-center items-center">
            <Text className="text-gray-700">No Image</Text>
          </View>
        )}
        <Text className="mt-1 text-md text-dark font-psemibold">
          {item.price} DA
        </Text>
        <Text className="text-[10px] font-pregular mt-[-5px]">
          Min. order: {item.minQuantity} pieces
        </Text>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default SectionProduct;
