import { Redirect, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

const SignUpLayout = () => {
  return (
    <>
      <Stack>
        <Stack.Screen
          name="seller-buyer"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="choose-category"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="user-info"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="store-info"
          options={{
            headerShown: false,
          }}
        />
      </Stack>
    </>
  );
};

export default SignUpLayout;
