import { View, Text } from "react-native";
import React from "react";
import { LoadingBar, CustomButton, UserReview } from "@/components";

const StoreReviews = () => {
  return (
    <View className="mt-2 px-4">
      <View className="flex flex-row items-center">
        <Text className="text-[48px] font-pbold text-dark">4.7 </Text>
        <Text className="text-[32px] font-psemibold text-dark">/5</Text>
      </View>
      <View className="flex flex-row justify-between items-center">
        <View>
          <Text>Supplier service</Text>
          <Text>On-time shipment</Text>
          <Text>Product quality</Text>
        </View>
        <View className="w-[50%] mt-1 flex flex-row items-center mr-2">
          <View className="w-[92%]">
            <LoadingBar percentage={(4.7 * 100) / 5} containerStyle="mb-3" />
            <LoadingBar percentage={(4.7 * 100) / 5} containerStyle="mb-3" />
            <LoadingBar percentage={(4.7 * 100) / 5} />
          </View>
          <View className="text-xs">
            <Text>4.7</Text>
            <Text>4.7</Text>
            <Text>4.7</Text>
          </View>
        </View>
      </View>
      <View className="flex flex-row flex-wrap w-full items-center mt-5">
        <CustomButton
          title="All"
          //handlePress={submit}
          containerStyles="mr-2 min-h-[28px] rounded-full bg-[#f5f5f5] border-[1px] border-dark-light px-5"
          textStyles="text-dark text-[14px] font-pmedium"
        />
        <CustomButton
          title="5 starts (14)"
          //handlePress={submit}
          containerStyles="mr-2 min-h-[28px] rounded-full bg-[#f5f5f5] border-[1px] border-dark-light px-3"
          textStyles="text-dark text-[14px] font-pmedium"
        />
        <CustomButton
          title="4 starts (28)"
          //handlePress={submit}
          containerStyles="mr-2 min-h-[28px] rounded-full bg-[#f5f5f5] border-[1px] border-dark-light px-3"
          textStyles="text-dark text-[14px] font-pmedium"
        />
        <CustomButton
          title="3 starts (9)"
          //handlePress={submit}
          containerStyles="mt-4 mr-2 min-h-[28px] rounded-full bg-[#f5f5f5] border-[1px] border-dark-light px-3"
          textStyles="text-dark text-[14px] font-pmedium"
        />
        <CustomButton
          title="2 starts (4)"
          //handlePress={submit}
          containerStyles="mr-2 min-h-[28px] rounded-full bg-[#f5f5f5] border-[1px] border-dark-light px-3"
          textStyles="text-dark text-[14px] font-pmedium"
        />
        <CustomButton
          title="1 starts (1)"
          //handlePress={submit}
          containerStyles="min-h-[28px] rounded-full bg-[#f5f5f5] border-[1px] border-dark-light px-3"
          textStyles="text-dark text-[14px] font-pmedium"
        />
      </View>
      <View className="mt-2 w-full">
        <UserReview />
        <UserReview />
      </View>
    </View>
  );
};

export default StoreReviews;
