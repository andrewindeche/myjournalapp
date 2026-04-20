import React from "react";
import { Text, StyleSheet } from "react-native";
import { CustomTextProps } from "../types";

const CustomText: React.FC<CustomTextProps> = ({ style, children }) => {
  return <Text style={[styles.defaultFont, style]}>{children}</Text>;
};

const styles = StyleSheet.create({
  defaultFont: {
    fontFamily: "Mulish-Black",
  },
});

export default CustomText;
