import { View, Text } from "react-native";
import React from "react";
import { useAuthContext } from "@/context/AuthProvider";

const home = () => {
  const { logout } = useAuthContext();

  return (
    <View>
      <Text>home</Text>
      <Text onPress={logout} className="mt-4">
        Logout
      </Text>
    </View>
  );
};

export default home;
