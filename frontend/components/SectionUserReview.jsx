import {
  View,
  Text,
  TouchableOpacity,
  LayoutAnimation,
  UIManager,
  Platform,
} from "react-native";
import React, { useState } from "react";
import { StarRating } from "@/components";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const SectionUserReview = () => {
  return (
    <View className="mt-2">
      <View className="flex flex-row items-start">
        <View>
          <View className="flex justify-center items-center h-[28px] w-[28px] border border-dark-lighter rounded-full bg-gray-lighter">
            <Text className="">C</Text>
          </View>
          <View className="w-[2px] bg-gray-300 my-4 ml-2" />
        </View>
        <View className="ml-2 flex-1">
          <StarRating rating={4.7} color="#fd7014" size={14} />
          <Text numberOfLines={2} className="mt-1 text-xs font-pregular">
            Le lorem ipsum est, en imprimerie, une suite de mots sans
            signification utilisée à titre provisoire pour calibrer une mise en
            page, le texte définitif venant remplacer le faux-texte dès qu'il
            est prêt ou que la mise en page est achevée.
          </Text>
          <Text className="mt-1 text-xs font-pregular text-[#808080]">
            C**s, 14 Aug 2024
          </Text>
        </View>
      </View>
    </View>
  );
};

export default SectionUserReview;
