import { View, Text, ScrollView } from "react-native";
import React from "react";
import StoreItem from "../components/StoreItem";

const StoreListContainer = ({ data }) => {
  return (
    <ScrollView className="">
      {data.map((store, index) => (
        <StoreItem key={index} store={store} />
      ))}
    </ScrollView>
  );
};

export default StoreListContainer;
