import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";

const BusinessHoursInput = ({ editObj, setEditObj, storeData }) => {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [currentPicker, setCurrentPicker] = useState(null);

  const showDatePicker = (picker) => {
    setCurrentPicker(picker);
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    const time = date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    if (currentPicker === "start") {
      setEditObj({ ...editObj, start: time });
    } else if (currentPicker === "end") {
      setEditObj({ ...editObj, end: time });
    }
    hideDatePicker();
  };

  return (
    <View className="border-t border-gray-lighter py-2 px-4 mt-[2px]">
      <View className="flex flex-row items-center justify-between">
        <Text className="font-pmedium text-lg text-dark-light">
          Business Hours
        </Text>
        <Text
          onPress={() => setEditObj({ ...editObj, start: "", end: "" })}
          className="font-pregular text-lg text-secondary"
        >
          {storeData?.start ? "Edit" : "Add"}
        </Text>
      </View>
      {Object.keys(editObj).find((k) => k === "start" || k === "end") ? (
        <>
          <TouchableOpacity
            className="w-full px-4 py-1 mb-4 mt-2 bg-white border border-gray-300 rounded-lg"
            onPress={() => showDatePicker("start")}
          >
            <Text className="font-pmedium my-1 text-gray-500">
              {`Start Time: ${editObj.start || "Enter your start time..."}`}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="w-full px-4 py-1 mb-4 bg-white border border-gray-300 rounded-lg"
            onPress={() => showDatePicker("end")}
          >
            <Text className="font-pmedium my-1 text-gray-500">
              {`End Time: ${editObj.end || "Enter your end time..."}`}
            </Text>
          </TouchableOpacity>
        </>
      ) : (
        storeData?.start && (
          <Text className="text-center text-primary-light font-pregular text-base">
            {storeData.start} - {storeData.end}
          </Text>
        )
      )}
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="time"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />
    </View>
  );
};

export default BusinessHoursInput;
