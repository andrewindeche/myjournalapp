import React, { ReactNode } from "react";
import { Text, TextStyle, StyleSheet } from "react-native";

interface CustomTextProps {
  style?: TextStyle | TextStyle[];
  children: ReactNode;
}

const CustomText: React.FC<CustomTextProps> = ({ style, children }) => {
  return <Text style={[styles.defaultFont, style]}>{children}</Text>;
};

const styles = StyleSheet.create({
  defaultFont: {
    fontFamily: "Mulish-Black",
  },
});

export default CustomText;
