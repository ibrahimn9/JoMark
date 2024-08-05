import { Redirect, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useGlobalContext } from "@/context/GlobalProvider";

const ProductLayout = () => {
  const { areTabsVisible, isBottomSheetOpened } = useGlobalContext();

  return (
    <>
      <Stack>
        <Stack.Screen
          name="products"
          options={{
            headerTitle: "Product List",
            headerShadowVisible: false,
            headerTitleStyle: {
              fontFamily: "Poppins-Medium",
            },
            headerStyle: {
              backgroundColor: !areTabsVisible ? "rgba(0, 0, 0, 0.4)" : "#fff",
            },
          }}
        />
        <Stack.Screen
          name="add-product"
          options={{
            headerTitle: "New Product",
            headerShadowVisible: false,
            headerTitleStyle: {
              fontFamily: "Poppins-Medium",
            },
            headerStyle: {
              backgroundColor:
              isBottomSheetOpened
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

export default ProductLayout;
