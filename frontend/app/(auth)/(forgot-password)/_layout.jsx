import { Redirect, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

const ForgotPasswordLayout = () => {
  return (
    <>
      <Stack>
        <Stack.Screen
          name="forgot-password"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="verify-code"
          options={{
            headerTitle: "Forgot password",
            headerShadowVisible: false,
            headerStyle: {
              backgroundColor: "#f5f5f5",
            },
            headerTitleStyle: {
              fontFamily: "Poppins-Medium",
            },
          }}
        />
        <Stack.Screen
          name="reset-password"
          options={{
            headerTitle: "Forgot password",
            headerShadowVisible: false,
            headerTitleStyle: {
              fontFamily: "Poppins-Medium",
            },
            headerStyle: {
              backgroundColor: "#f5f5f5",
            },
          }}
        />
      </Stack>
      <StatusBar style="dark" />
    </>
  );
};

export default ForgotPasswordLayout;
