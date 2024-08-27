import { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";

const useHeaderBackground = (isBottomSheetOpened) => {
  const [headerBackground, setHeaderBackground] = useState("fff");
  const navigation = useNavigation();

  useEffect(() => {
    if (isBottomSheetOpened) {
      setHeaderBackground("rgba(0, 0, 0, 0.5)");
    } else {
      setHeaderBackground("fff");
    }

    navigation.setOptions({
      headerStyle: {
        backgroundColor: headerBackground,
      },
    });
  }, [isBottomSheetOpened, headerBackground, navigation]);

  return headerBackground;
};

export default useHeaderBackground;
