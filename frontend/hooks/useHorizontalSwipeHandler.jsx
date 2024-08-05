import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated, { useAnimatedGestureHandler, useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';

const useHorizontalSwipeHandler = (maxSwipeDistance) => {
  const translateX = useSharedValue(0);

  const handleGesture = useAnimatedGestureHandler({
    onStart: (event, ctx) => {
      ctx.startX = translateX.value;
    },
    onActive: (event, ctx) => {
      translateX.value = ctx.startX + event.translationX;
      translateX.value = Math.max(Math.min(translateX.value, 0), -maxSwipeDistance);
    },
    onEnd: () => {
      // Add any logic for snapping or spring animation
      translateX.value = withSpring(translateX.value);
    },
  });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return { handleGesture, animatedStyle };
};

export default useHorizontalSwipeHandler;
