import React from "react";
import { View, Text } from "react-native";
import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import { styled } from "nativewind";

const StarRating = ({ rating, size, color }) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating - fullStars >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  return (
    <View className="flex-row items-center">
      {[...Array(fullStars)].map((_, index) => (
        <FontAwesome
          key={`full-${index}`}
          name="star"
          size={size || 18}
          color={color || "#253444"}
        />
      ))}
      {halfStar && (
        <FontAwesome name="star-half-o" size={size || 18} color={ color || "#253444" } />
      )}
      {[...Array(emptyStars)].map((_, index) => (
        <FontAwesome
          key={`empty-${index}`}
          name="star-o"
          size={size || 18}
          color={color || "#253444"}
        />
      ))}
    </View>
  );
};

export default styled(StarRating);
