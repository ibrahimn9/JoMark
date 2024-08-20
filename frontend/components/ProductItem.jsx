import {
  View,
  Text,
  Image,
  ActivityIndicator,
  TouchableWithoutFeedback,
} from "react-native";
import React, { useState } from "react";
import { router } from "expo-router";

const ProductItem = ({ item, index, showDate }) => {
  const [loading, setLoading] = useState(true);

  const dateCreated = new Date(item.dateCreation);
  const today = new Date();
  const differenceInTime = today.getTime() - dateCreated.getTime();
  const differenceInDays = Math.floor(differenceInTime / (1000 * 3600 * 24));

  return (
    <TouchableWithoutFeedback
      onPress={() => router.push(`/buyer/details/${item.id}`)}
    >
      <View
        className="mb-3"
        style={{
          marginRight: index % 2 === 0 ? 8 : 0,
        }}
      >
        {item.imageUrl?.length || item.imageUrl ? (
          <View className="rounded-md w-full h-[165px] bg-gray-200 justify-center items-center">
            <Image
              source={{ uri: item.imageUrl[0].link || item.imageUrl }}
              className="rounded-md w-full h-[165px]"
              onLoad={() => setLoading(false)}
              onError={() => setLoading(false)}
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
          <View className="rounded-md w-full h-[165px] bg-gray-200 justify-center items-center">
            <Text className="text-gray-700">No Image</Text>
          </View>
        )}
        {showDate && (
          <Text className="text-[11px] mt-1 font-pmedium text-red-400">
            listed {differenceInDays} day{differenceInDays > 1 ? "s" : ""} ago
          </Text>
        )}
        <Text
          numberOfLines={2}
          className={`text-xs font-pregular ${!showDate ? "mt-2" : ""}`}
        >
          {item.name}
        </Text>
        <Text className="mt-1 text-lg text-dark font-psemibold">
          {item.price} DA
        </Text>
        <Text className="text-xs font-pregular">
          Min. order: {item.minQuantity} pieces
        </Text>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default ProductItem;
