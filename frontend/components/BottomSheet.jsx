import React, { useCallback, useImperativeHandle, forwardRef } from "react";
import { Dimensions, View, Text } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useGlobalContext } from "@/context/GlobalProvider";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const MAX_TRANSLATE_Y = -SCREEN_HEIGHT + 50;

const BottomSheet = forwardRef(({ children }, ref) => {
  const translateY = useSharedValue(0);
  const active = useSharedValue(false);

  const { intiTranslateY, setIsBottomSheetOpened } = useGlobalContext();
  const INITIAL_TRANSLATE_Y = intiTranslateY || -SCREEN_HEIGHT / 3;

  const scrollTo = useCallback((destination) => {
    active.value = destination !== 0;
    translateY.value = withSpring(destination, { damping: 50 });
  }, []);

  const isActive = useCallback(() => {
    return active.value;
  }, []);

  useImperativeHandle(ref, () => ({ scrollTo, isActive }), [
    scrollTo,
    isActive,
  ]);

  const context = useSharedValue({ y: 0 });
  const gesture = Gesture.Pan()
    .onStart(() => {
      context.value = { y: translateY.value };
    })
    .onUpdate((event) => {
      translateY.value = event.translationY + context.value.y;
      translateY.value = Math.max(translateY.value, MAX_TRANSLATE_Y);
    })
    .onFinalize(() => {
      if (translateY.value > -SCREEN_HEIGHT / 4) {
        translateY.value = withSpring(0, { damping: 50 });
      } else {
        translateY.value = withSpring(INITIAL_TRANSLATE_Y, { damping: 50 });
      }
    });

  const rBottomSheetStyle = useAnimatedStyle(() => {
    const borderRadius = interpolate(
      translateY.value,
      [MAX_TRANSLATE_Y + 50, MAX_TRANSLATE_Y],
      [25, 5],
      Extrapolate.CLAMP
    );

    return {
      borderRadius,
      transform: [{ translateY: translateY.value }],
    };
  });

  

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View
        style={[
          {
            minHeight: SCREEN_HEIGHT,
            width: "100%",
            backgroundColor: "white",
            position: "absolute",
            top: SCREEN_HEIGHT,
            borderRadius: 25,
            zIndex: 1100,
            bottom: 0,
            pointerEvents: "auto",
          },
          rBottomSheetStyle,
        ]}
      >
        <View className="w-16 h-1 bg-gray-400 self-center my-2 rounded-full" />
        {children}
      </Animated.View>
    </GestureDetector>
  );
});

export default BottomSheet;
