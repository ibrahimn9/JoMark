import { Redirect, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useGlobalContext } from "@/context/GlobalProvider";

const StoreLayout = () => {
  const { areTabsVisible, isBottomSheetOpened } = useGlobalContext();

  return (
    <>
      <Stack>
        <Stack.Screen
          name="store"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="edit-store"
          options={{
            headerTitle: "Edit Store",
            headerShadowVisible: false,
            headerTitleStyle: {
              fontFamily: "Poppins-Medium",
            },
            headerStyle: {
              backgroundColor: isBottomSheetOpened
                ? "rgba(0, 0, 0, 0.4)"
                : "#fff",
            },
          }}
        />
      </Stack>
      <StatusBar style="dark" />
    </>
  );
};

export default StoreLayout;
