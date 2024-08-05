import React, { createContext, useContext, useEffect, useState } from "react";

const GlobalContext = createContext();
export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ({ children }) => {
  const [selectedLang, setSelectedLang] = useState("EN");
  const [langClicked, setLangClicked] = useState(false);

  const [resetEmail, setResetEmail] = useState("");

  const [intiTranslateY, setIntiTranslateY] = useState();
  const [isBottomSheetOpened, setIsBottomSheetOpened] = useState(false);

  const [refreshProduct, setRefreshProduct] = useState(false);

  // Tabs visibility
  const [areTabsVisible, setAreTabsVisible] = useState(true);

  const showTabs = () => setAreTabsVisible(true);
  const hideTabs = () => setAreTabsVisible(false);

  const [userData, setUserData] = useState({
    fullName: null,
    email: null,
    password: null,
    phoneNumber: null,
    store: {},
    categories: [],
  });

  return (
    <GlobalContext.Provider
      value={{
        selectedLang,
        setSelectedLang,
        userData,
        setUserData,
        langClicked,
        setLangClicked,
        resetEmail,
        setResetEmail,
        intiTranslateY,
        setIntiTranslateY,
        isBottomSheetOpened,
        setIsBottomSheetOpened,
        refreshProduct,
        setRefreshProduct,
        areTabsVisible,
        showTabs,
        hideTabs,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
