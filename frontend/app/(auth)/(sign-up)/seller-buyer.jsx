import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Image,
  TouchableWithoutFeedback,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import React, { useState, useRef, useEffect } from "react";
import images from "../../../constants/images";
import {
  CustomButton,
  CustomCheckButton,
  SelectLangAlert,
  SkipBtn,
} from "@/components";
import { useGlobalContext } from "@/context/GlobalProvider";
import { useAuthContext } from "@/context/AuthProvider";
import dictionary from "@/constants/dictionary.json";
import { router } from "expo-router";
import BottomSheet, {
  BottomSheetView,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useHeaderBackground from "@/hooks/useHeaderBackground";

const SellerOrBayer = () => {
  const [selectedRole, setSelectedRole] = useState("");

  const {
    selectedLang,
    setSelectedLang,
    userData,
    setUserData,
    langClicked,
    setLangClicked,
  } = useGlobalContext();
  const { handleFlag } = useAuthContext();
  const selectedDict = dictionary.sellerOrBayerScreen[selectedLang];

  // Bottom sheet
  const [isBottomSheetOpened, setIsBottomSheetOpened] = useGlobalContext();
  const bottomSheetRef = useRef(null);
  const [bottomSheetComp, setBottomSheetComp] = useState("");



  const initialSnapPoints = [280, 300];

  const openBottomSheet = () => {
    if (bottomSheetRef.current) {
      bottomSheetRef.current.snapToIndex(0);
    }
    setIsBottomSheetOpened(true);
  };

  const closeBottomSheet = () => {
    setIsBottomSheetOpened(false);
    if (bottomSheetRef.current) {
      bottomSheetRef.current.close();
    }
  };

  useEffect(() => {
    if (!langClicked) {
      openBottomSheet();
    } else {
      closeBottomSheet();
    }
  }, []);

  //selecting lang
  const saveSelectedLang = async (lang) => {
    try {
      await AsyncStorage.setItem("selectedLang", lang);
      setSelectedLang(lang);
    } catch (error) {
      console.error("Error saving selectedLang to AsyncStorage:", error);
    }
  };

  return (
    <GestureHandlerRootView className="flex-1">
      <SafeAreaView className="relative h-full">
        {isBottomSheetOpened && (
          <View
            className="absolute h-full w-full z-[120]"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.4)" }}
          />
        )}
        <ScrollView
          contentContainerStyle={{
            height: "100%",
          }}
        >
          <View className="w-full bg-[#fff] flex justify-between items-center min-h-full px-4 py-10">
            <View>
              <Image
                source={images.sellerOrBayer}
                className="w-[360px] h-[360px]"
                resizeMode="contain"
              />
              <View className="px-4 mt-[-35px]">
                <Text className="text-3xl text-secondary-light font-pbold text-center mb-2">
                  {selectedDict.questionTitle}
                </Text>
              </View>
              <View className="px-4 mt-4">
                <CustomCheckButton
                  handlePress={() => setSelectedRole("seller")}
                  title={selectedDict.sellerTitle}
                  text={selectedDict.sellerText}
                  icon={images.sellerIcon}
                  isSelected={selectedRole === "seller"}
                />
                <CustomCheckButton
                  handlePress={() => setSelectedRole("bayer")}
                  title={selectedDict.bayerTitle}
                  text={selectedDict.bayerText}
                  containerStyles="mt-2"
                  icon={images.bayerIcon}
                  isSelected={selectedRole === "bayer"}
                />
              </View>
            </View>
          </View>
        </ScrollView>
        <View className="absolute bottom-0 left-0 w-full bg-white min-h-[80px] flex justify-center items-center px-4">
          <CustomButton
            title={selectedDict.nextBtn}
            handlePress={async () => {
              setUserData({
                ...userData,
                isSeller: selectedRole === "seller",
              });
              if (selectedRole === "seller") router.push("choose-category");
              else {
                await handleFlag("unregisteredBuyer");
                router.replace("/buyer/home");
              }
            }}
            containerStyles="w-full text-white min-h-[48px] rounded-full"
            textStyles="text-white"
            disabled={selectedRole === ""}
          />
        </View>

        <BottomSheet
          ref={bottomSheetRef}
          index={0}
          snapPoints={initialSnapPoints}
          enablePanDownToClose={true}
          onClose={() => closeBottomSheet()}
          containerStyle={{ zIndex: 1500 }}
        >
          <View className="p-4">
            <Text className="text-lg">Choose Language</Text>
            <View className="mt-8 w-full px-6">
              <CustomButton
                title="عربية"
                handlePress={() => {
                  saveSelectedLang("AR");
                  setSelectedLang("AR");
                  setLangClicked(true);
                  closeBottomSheet();
                }}
                containerStyles="w-full text-white min-h-[40px]"
                textStyles="text-white"
              />
              <CustomButton
                title="English"
                handlePress={() => {
                  saveSelectedLang("EN");
                  setSelectedLang("EN");
                  setLangClicked(true);
                  closeBottomSheet();
                }}
                containerStyles="w-full mt-2 text-white min-h-[40px]"
                textStyles="text-white font-pmedium"
              />
              <CustomButton
                title="Français"
                handlePress={() => {
                  saveSelectedLang("FR");
                  setSelectedLang("FR");
                  setLangClicked(true);
                  closeBottomSheet();
                }}
                containerStyles="w-full mt-2 text-white min-h-[40px]"
                textStyles="text-white font-pmedium"
              />
            </View>
          </View>
        </BottomSheet>

        <SkipBtn next="/buyer/home" method="replace" lazy={true} />
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default SellerOrBayer;
