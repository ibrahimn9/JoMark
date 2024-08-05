import React from "react";
import { View, Text } from "react-native";

const LoadingBar = ({ percentage, containerStyle, otherStyle, value }) => {
  return (
    <View
      className={`w-[92%] bg-gray-light rounded-md overflow-hidden ${containerStyle}`}
    >
      <View
        className={`bg-highlight h-2 rounded-md ${otherStyle}`}
        style={{
          width: `${percentage}%`,
        }}
      />
    </View>
  );
};

export default LoadingBar;
