import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { SectionProduct } from "@/components";

const LoadingView = () => {
  return (
    <View className="mr-1">
      <View className="rounded-md w-[105px] h-[110px] bg-gray-200 justify-center items-center" />
      <View className="mt-1 bg-gray-200 h-1 w-[80%] rounded-full" />
      <View className="mt-1 bg-gray-200 h-1 w-[60%] rounded-full" />
    </View>
  );
};

const ProductHorizentalContainer = ({
  title,
  sub,
  handleOpenPress,
  data,
  isLoading,
}) => {
  return (
    <View className="bg-white mt-2 py-2">
      <View className="flex-row justify-between px-4">
        <View>
          <Text className="font-pmedium text-dark text-base">{title}</Text>
          <Text className="font-pregular text-dark-lighter text-[10px]">
            {sub}
          </Text>
        </View>
        <TouchableOpacity onPress={handleOpenPress} className="mt-1">
          <FontAwesome6 name="arrow-right" size={20} color="black" />
        </TouchableOpacity>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="flex flex-row w-full mt-1 pl-4"
      >
        {isLoading || !data
          ? [...Array(6)].map((_, index) => (
              <LoadingView key={index} index={index} />
            ))
          : data?.map((product, index) => (
              <SectionProduct item={product} key={index} />
            ))}
        <View className="w-[20px] h-[110px]" />
      </ScrollView>
    </View>
  );
};

export default ProductHorizentalContainer;
