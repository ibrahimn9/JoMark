import { View, Text, FlatList, TouchableOpacity } from "react-native";
import React from "react";
import { SellerProduct } from "@/components";

const SellerProductsContainer = ({
  loading,
  data,
  openBottomSheet,
  setProductData,
}) => {
  return (
    <FlatList
      data={data}
      renderItem={({ item }) => (
        <SellerProduct
          item={item}
          openBottomSheet={openBottomSheet}
          setProductData={setProductData}
        />
      )}
      keyExtractor={(item) => item.id}
    />
  );
};

export default SellerProductsContainer;
