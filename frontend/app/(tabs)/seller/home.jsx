import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import React, {
  useRef,
  useEffect,
  useCallback,
  useImperativeHandle,
} from "react";
import { useAuthContext } from "@/context/AuthProvider";
import { useGlobalContext } from "@/context/GlobalProvider";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";

const home = () => {
  const { logout } = useAuthContext();
  const { setIsBottomSheetOpened } = useGlobalContext();
  useEffect(() => {
    setIsBottomSheetOpened(false);
  }, []);
  return (
    <View className="flex flex-1 justify-center items-center">
      <Text onPress={logout}>Logout</Text>
    </View>
  );
};

export default home;
