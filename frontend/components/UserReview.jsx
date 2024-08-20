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

const UserReview = () => {
  const [expanded, setExpanded] = useState(false);
  const [showButtons, setShowButtons] = useState(false);
  const [liked, setLiked] = useState(false);

  // Enable LayoutAnimation for Android
  if (Platform.OS === "android") {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }

  const toggleExpanded = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
  };

  const onTextLayout = (event) => {
    setShowButtons(event.nativeEvent.lines.length > 5);
  };

  const toggleLike = () => {
    setLiked(!liked);
  };

  return (
    <View className="p-4">
      <View className="flex flex-row items-start">
        <View>
          <View className="flex justify-center items-center h-[48px] w-[48px] border-[2px] border-dark-lighter rounded-full bg-gray-lighter">
            <Text className="">C</Text>
          </View>
          <View className="w-[2px] bg-gray-300 my-4 ml-2" />
        </View>
        <View className="ml-4 flex-1">
          <Text>C**a</Text>
          <Text className="text-xs text-gray-500 mb-1">Jul 17, 2024</Text>
          <StarRating rating={4.7} color="#fd7014" />
          <Text
            onTextLayout={onTextLayout}
            numberOfLines={expanded ? undefined : 5}
            className="mt-1 text-sm text-gray-700"
          >
            Le lorem ipsum est, en imprimerie, une suite de mots sans
            signification utilisée à titre provisoire pour calibrer une mise en
            page, le texte définitif venant remplacer le faux-texte dès qu'il
            est prêt ou que la mise en page est achevée.
          </Text>
          {showButtons && (
            <TouchableOpacity onPress={toggleExpanded}>
              <Text className="text-sm text-accent">
                {expanded ? "Read less" : "Read more"}
              </Text>
            </TouchableOpacity>
          )}
          <View className="flex flex-row items-center mt-2">
            <TouchableOpacity onPress={toggleLike} className="">
              <MaterialCommunityIcons
                name={liked ? "cards-heart" : "cards-heart-outline"}
                size={24}
                color="#253444"
              />
            </TouchableOpacity>
            <Text className="ml-4 text-dark font-pmedium">Reply</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default UserReview;
