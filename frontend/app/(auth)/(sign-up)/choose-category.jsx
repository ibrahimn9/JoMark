import { View, Text, ScrollView, SafeAreaView } from "react-native";
import React, { useState } from "react";
import categories from "@/constants/categories";
import { CustomSelectButton, CustomButton, SkipBtn } from "@/components";
import { StatusBar } from "expo-status-bar";
import { useGlobalContext } from "@/context/GlobalProvider";
import dictionary from "@/constants/dictionary.json";
import { router } from "expo-router";

const ChooseCategory = () => {
  const { selectedLang, setSelectedLang, userData, setUserData } =
    useGlobalContext();
  const selectedDict = dictionary.chooseCategoryScreen[selectedLang];

  // Selecting categories

  const [selectedCategories, setSelectedCategories] = useState([]);

  return (
    <SafeAreaView className="h-full">
      <View className="relative h-full">
        <View className="w-full bg-[#fff] flex min-h-full px-4 pt-[80px]">
          <Text className="text-3xl text-dark font-pbold mb-4">
            {selectedDict.title}
          </Text>
          <ScrollView showsVerticalScrollIndicator={false}>
            {categories.data.map((cat, index) => (
              <CustomSelectButton
                key={index}
                handlePress={() => {
                  if (selectedCategories.includes(cat.id)) {
                    setSelectedCategories(
                      selectedCategories.filter((c) => c !== cat.id)
                    );
                  } else
                    setSelectedCategories(selectedCategories.concat(cat.id));
                }}
                isSelected={selectedCategories.includes(cat.id)}
                title={selectedDict[cat.id]}
                icon={cat.icon}
                containerStyles="mb-2"
              />
            ))}
            <View className="bg-white w-full min-h-[140px]" />
          </ScrollView>
        </View>
        <View className="absolute bottom-0 left-0 w-[100%] bg-white min-h-[80px] z-[100] flex justify-center items-center px-4">
          <CustomButton
            title={selectedDict.applyBtn}
            containerStyles="w-full text-white min-h-[40px] rounded-full"
            textStyles="text-white"
            disabled={!selectedCategories.length}
            handlePress={() => {
              setUserData({ ...userData, categories: selectedCategories });
              router.push("user-info");
            }}
          />
        </View>
        <SkipBtn next="user-info" method="push" />
      </View>
      <StatusBar style="dark" backgroundColor="#fff" />
    </SafeAreaView>
  );
};

export default ChooseCategory;
