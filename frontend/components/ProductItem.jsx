import { View, Text, Image, ActivityIndicator } from "react-native";
import React, { useState } from "react";

const ProductItem = ({ item, index }) => {
  const [loading, setLoading] = useState(true);

  return (
    <View
      className="mb-3"
      style={{
        marginRight: index % 2 === 0 ? 8 : 0,
      }}
    >
      {item.imageUrl ? (
        <View className="rounded-md w-full h-[165px] bg-gray-200 justify-center items-center">
          <Image
            source={{ uri: item.imageUrl }}
            className="rounded-md w-full h-[165px]"
            onLoad={() => setLoading(false)}
            onError={() => setLoading(false)}
          />
          {loading && (
            <ActivityIndicator
              size="small"
              color="#ffffff"
              style={{ position: 'absolute' }}
            />
          )}
        </View>
      ) : (
        <View className="rounded-md w-full h-[165px] bg-gray-400 justify-center items-center">
          <Text className="text-gray-700">No Image</Text>
        </View>
      )}

      <Text numberOfLines={2} className="mt-2 text-xs font-pregular">
        {item.name}
      </Text>
      <Text className="mt-1 text-lg text-dark font-psemibold">
        {item.price} DA
      </Text>
      <Text className="text-xs font-pregular">
        Min. order: {item.minQuantity} pieces
      </Text>
    </View>
  );
};

export default ProductItem;
