import {
  View,
  Text,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useState } from "react";
import categories from "../constants/categories.json";
import StarRating from "./StarRating";

const StoreItem = ({ store }) => {
  const [loading, setLoading] = useState(true);
  console.log(store);
  return (
    <TouchableOpacity className="flex flex-row w-full px-4 py-6 border-t border-gray-lighter bg-white">
      <View className="w-[65px] mr-8">
        {store.storePic ? (
          <View className="rounded-full border-[2px] border-accent w-[65px] h-[65px] bg-gray-200 justify-center items-center overflow-hidden">
            <Image
              source={{ uri: store.storePic }}
              className="rounded-md w-full h-[165px]"
              onLoad={() => setLoading(false)}
              onError={() => setLoading(false)}
              resizeMode="contain"
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
          <View className="rounded-full w-[65px] h-[65px] border-[2px] border-accent bg-gray-200 justify-center items-center">
            <Text className="text-gray-700">No Image</Text>
          </View>
        )}
        <Text className="text-center text-primary font-psemibold mt-1">
          {store.name}
        </Text>
      </View>
      <View className="flex-1">
        <Text className="mt-1 text-md font-pregular">
          Distance: {store.distanceDisplay}
        </Text>
        <Text className="mt-1 text-md font-pregular">
          Category:{"  "}
          {categories.data
            .filter((cat) => store.categories.includes(cat.id))
            .map((cat) => cat.name)
            .join(" , ")}
        </Text>
        <View className="flex-row items-center mt-1">
          <StarRating rating={4.7} size={14} color="#fd7014" />
          <Text className="text-xs font-pregular ml-1">4.7 (63 reviews)</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default StoreItem;
