import {
  View,
  Text,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useState, useRef, useCallback } from "react";
import CustomButton from "../CustomButton";
import { MaterialIcons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useGlobalContext } from "@/context/GlobalProvider";
import { useAuthContext } from "@/context/AuthProvider";
import product from "@/services/product";

const SellerProduct = ({ item, openBottomSheet, setProductData, setMedia }) => {
  const [loading, setLoading] = useState(true);
  const { userToken } = useAuthContext();
  const { refreshProduct, setRefreshProduct, hide, setHide } =
    useGlobalContext();

  const handleDelete = (itemId) => {
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete this product?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Deletion cancelled"),
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: async () => {
            try {
              await deleteItem(itemId);
              console.log("Item deleted");
            } catch (error) {
              console.error("Error deleting item:", error);
              Alert.alert("Error", "There was an error deleting the item.");
            }
          },
          style: "destructive",
        },
      ],
      { cancelable: true }
    );
  };

  const deleteItem = async (itemId) => {
    try {
      const response = await product.deleteProduct(itemId, userToken);
      console.log(response.data);
      setRefreshProduct(!refreshProduct);
      openBottomSheet("delete-edit", [100, 200]);
    } catch (error) {
      console.error("Error deleting product:", error);
      Alert.alert("Error deleting product");
    }
  };

  return (
    <TouchableOpacity className="flex flex-row w-full px-4 py-6 border-t border-gray-lighter">
      <View className="w-[120px] mr-4">
        {item.imageUrl?.length ? (
          <View className="rounded-md w-full h-[120px] bg-gray-200 justify-center items-center overflow-hidden">
            <Image
              source={{ uri: item.imageUrl[0].link }}
              className="rounded-md w-full h-[165px]"
              onLoad={() => setLoading(false)}
              onError={() => setLoading(false)}
            />
            {loading && (
              <ActivityIndicator
                size="small"
                color="#ffffff"
                style={{ position: "absolute" }}
              />
            )}
          </View>
        ) : (
          <View className="rounded-md w-full h-[120px] bg-gray-200 justify-center items-center">
            <Text className="text-gray-700">No Image</Text>
          </View>
        )}
      </View>
      <View className="flex-1">
        <Text numberOfLines={1} className="text-base font-pmedium">
          {item.name}
        </Text>
        <Text className="mt-1 text-xs font-pregular">
          Stock: {item.quantity} in stock
        </Text>
        <Text className="text-xs font-pregular">Order: 8</Text>
        <Text className="text-xs font-pregular">Sales: 12</Text>
        <View className="flex flex-row justify-between items-center z-[12]">
          <CustomButton
            title="Active"
            //handlePress={submit}
            containerStyles="min-h-[32px] mt-2 max-w-[85px] rounded-full bg-white border-[1px] border-third px-2"
            icon="radio-button-checked"
            iconColor="#1DCC79"
            iconSize={20}
            textStyles="text-third text-xs"
          />
          <View className="flex flex-row items-center z-[12]">
            <TouchableOpacity
              onPress={() => {
                setProductData({
                  id: item.id,
                  name: item.name,
                  description: item.description?.toString(),
                  price: item.price?.toString(),
                  quantity: item.quantity?.toString(),
                  minQuantity: item.minQuantity?.toString(),
                  categoryId: item.categoryId,
                  documents: item.imageUrl,
                });
                setMedia(
                  item.imageUrl?.map((im) => ({
                    uri: im.link,
                    type: "image",
                    uploaded: true,
                  })) || []
                );
                openBottomSheet("edit", [100, 620]);
              }}
            >
              <MaterialCommunityIcons
                name="archive-edit-outline"
                size={22}
                color="#7092a8"
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleDelete(item.id)}
              className="ml-3"
            >
              <MaterialCommunityIcons
                name="delete-outline"
                size={22}
                color="#7092a8"
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default SellerProduct;
