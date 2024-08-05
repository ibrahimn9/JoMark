import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";


const CustomButton = ({
  title,
  handlePress,
  icon,
  iconColor,
  iconSize,
  containerStyles,
  textStyles,
  isLoading,
  disabled,
}) => {
  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.7}
      className={`bg-secondary rounded-xl min-h-[62px] flex flex-row ${
        icon ? "" : "justify-center"
      }  items-center ${containerStyles} ${
        isLoading || disabled ? "opacity-50" : ""
      }`}
      disabled={isLoading || disabled}
    >
      {icon && <MaterialIcons name={icon} size={iconSize} color={iconColor} />}
      <Text className={`text-primary font-psemibold text-lg ${
        icon ? "ml-1" : ""
      } ${textStyles}`}>
        {title}
      </Text>

      {isLoading && (
        <ActivityIndicator
          animating={isLoading}
          color="#fff"
          size="small"
          className="ml-2"
        />
      )}
    </TouchableOpacity>
  );
};

export default CustomButton;
