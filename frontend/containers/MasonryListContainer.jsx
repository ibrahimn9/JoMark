import { View, Text, ActivityIndicator } from "react-native";
import React from "react";
import { ProductItem } from "@/components";
import MasonryList from "@react-native-seoul/masonry-list";

const LoadingView = ({ index }) => {
  return (
    <View
      className="mb-3"
      style={{
        marginRight: index % 2 === 0 ? 8 : 0,
      }}
    >
      <View className="relative rounded-md w-[165px] h-[165px] bg-gray-200 justify-center items-center animate-pulse" />
      <View className="bg-gray-200 animate-pulse h-2 w-[165px] mt-2 rounded-sm" />
      <View className="bg-gray-200 animate-pulse h-2 w-[165px] mt-1 rounded-sm" />
      <View className="bg-gray-200 animate-pulse h-2 w-[25%] mt-1 rounded-sm" />
      <View className="bg-gray-200 animate-pulse h-2 w-[15%] mt-1 rounded-sm" />
    </View>
  );
};

const MasonryListContainer = ({ loading, data }) => {
  if (loading) {
    return (
      <View className="px-2 flex flex-row flex-wrap">
        {[...Array(6)].map((_, index) => (
          <LoadingView key={index} index={index} />
        ))}
      </View>
    );
  }

  return (
    <MasonryList
      data={data}
      numColumns={2}
      contentContainerStyle={{ paddingHorizontal: 16 }}
      showsVerticalScrollIndicator={false}
      renderItem={({ item, i }) => <ProductItem item={item} index={i} />}
      refreshing={false}
      LoadingView={() => <LoadingView />}
    />
  );
};

export default MasonryListContainer;
